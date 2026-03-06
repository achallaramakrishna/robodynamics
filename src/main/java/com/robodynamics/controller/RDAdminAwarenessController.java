package com.robodynamics.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Locale;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.robodynamics.model.RDBlogPost;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDBlogPostService;
import com.robodynamics.util.RDRoleRouteUtil;

@Controller
@RequestMapping("/admin/awareness")
public class RDAdminAwarenessController {

    @Autowired
    private RDBlogPostService blogPostService;

    @GetMapping
    public String dashboard(@RequestParam(value = "editId", required = false) Integer editId,
                            @RequestParam(value = "saved", required = false) String saved,
                            Model model,
                            HttpSession session) {
        String redirect = ensureAdmin(session, "/admin/awareness");
        if (redirect != null) {
            return redirect;
        }

        RDBlogPost editPost = (editId == null || editId <= 0) ? null : blogPostService.getBlogPostById(editId);
        if (editPost == null) {
            editPost = new RDBlogPost();
        }

        model.addAttribute("saved", nz(saved));
        model.addAttribute("posts", blogPostService.getAllBlogPostsForAdmin());
        model.addAttribute("editPost", editPost);
        return "admin/awareness-posts";
    }

    @PostMapping("/save")
    public String save(@RequestParam(value = "postId", required = false) Integer postId,
                       @RequestParam("title") String title,
                       @RequestParam(value = "excerpt", required = false) String excerpt,
                       @RequestParam(value = "href", required = false) String href,
                       @RequestParam(value = "imageUrl", required = false) String imageUrl,
                       @RequestParam(value = "isPublished", required = false) Integer isPublished,
                       HttpSession session) {
        String redirect = ensureAdmin(session, "/admin/awareness");
        if (redirect != null) {
            return redirect;
        }

        RDBlogPost post = (postId == null || postId <= 0) ? null : blogPostService.getBlogPostById(postId);
        boolean isCreate = (post == null);
        if (post == null) {
            post = new RDBlogPost();
        }
        String safeTitle = nz(title).trim();
        if (safeTitle.isEmpty()) {
            safeTitle = "Untitled AptiPath360 Update";
        }
        post.setTitle(safeTitle);
        post.setExcerpt(nz(excerpt).trim());
        post.setHref(normalizeHref(href));
        post.setImageUrl(nz(imageUrl).trim());
        post.setPublished(isPublished != null && isPublished == 1);
        blogPostService.saveOrUpdateBlogPost(post);
        return "redirect:/admin/awareness?saved=" + urlEncode(isCreate ? "created" : "updated");
    }

    @PostMapping("/toggle-publish")
    public String togglePublish(@RequestParam("postId") Integer postId,
                                @RequestParam("publish") Integer publish,
                                HttpSession session) {
        String redirect = ensureAdmin(session, "/admin/awareness");
        if (redirect != null) {
            return redirect;
        }
        RDBlogPost post = blogPostService.getBlogPostById(postId);
        if (post != null) {
            post.setPublished(publish != null && publish == 1);
            blogPostService.saveOrUpdateBlogPost(post);
        }
        return "redirect:/admin/awareness?saved=" + urlEncode("publish");
    }

    @PostMapping("/delete")
    public String delete(@RequestParam("postId") Integer postId,
                         HttpSession session) {
        String redirect = ensureAdmin(session, "/admin/awareness");
        if (redirect != null) {
            return redirect;
        }
        blogPostService.deleteBlogPostById(postId);
        return "redirect:/admin/awareness?saved=" + urlEncode("deleted");
    }

    private String ensureAdmin(HttpSession session, String path) {
        Object raw = session.getAttribute("rdUser");
        if (!(raw instanceof RDUser)) {
            return "redirect:/login?redirect=" + urlEncode(path);
        }
        RDUser user = (RDUser) raw;
        if (!isAdmin(user)) {
            return RDRoleRouteUtil.redirectHomeFor(user);
        }
        return null;
    }

    private boolean isAdmin(RDUser user) {
        if (user == null) {
            return false;
        }
        int profile = user.getProfile_id();
        return profile == RDUser.profileType.SUPER_ADMIN.getValue()
                || profile == RDUser.profileType.ROBO_ADMIN.getValue()
                || profile == RDUser.profileType.COMPANY_ADMIN.getValue();
    }

    private String normalizeHref(String href) {
        String value = nz(href).trim();
        if (value.isEmpty()) {
            return "/blog";
        }
        if (value.startsWith("http://") || value.startsWith("https://")) {
            return value;
        }
        if (value.startsWith("/")) {
            return value;
        }
        return "/" + value.toLowerCase(Locale.ENGLISH);
    }

    private String nz(String value) {
        return value == null ? "" : value;
    }

    private String urlEncode(String value) {
        return URLEncoder.encode(nz(value), StandardCharsets.UTF_8);
    }
}
