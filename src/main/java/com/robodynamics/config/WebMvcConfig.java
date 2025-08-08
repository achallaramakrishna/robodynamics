package com.robodynamics.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewResolverRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import com.robodynamics.util.RDVisitorInterceptor;

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "com.robodynamics")
public class WebMvcConfig implements WebMvcConfigurer {

	 @Autowired
	 private RDVisitorInterceptor rdVisitorInterceptor;
	 
    public void configureViewResolvers(ViewResolverRegistry registry) {
        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
        viewResolver.setPrefix("/WEB-INF/views/");
        viewResolver.setSuffix(".jsp");
        registry.viewResolver(viewResolver);
    }

    @Bean
    public CommonsMultipartResolver multipartResolver() {
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
        multipartResolver.setMaxUploadSize(10485760); // 10MB
        return multipartResolver;
    }
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**").addResourceLocations("/resources/images/");
        registry.addResourceHandler("/css/**").addResourceLocations("/resources/css/");
        registry.addResourceHandler("/assets/pdfs/**").addResourceLocations("/resources/assets/pdfs/");
        registry.addResourceHandler("/assets/videos/**").addResourceLocations("/resources/assets/videos/");
        registry.addResourceHandler("/assets/images/**").addResourceLocations("/resources/assets/images/");
        registry.addResourceHandler("/assets/audios/**").addResourceLocations("/resources/assets/audios/");
        registry.addResourceHandler("/resources/**").addResourceLocations("/resources/");
    }
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(rdVisitorInterceptor)
                .addPathPatterns("/**") // Apply to all paths
                .excludePathPatterns("/resources/**", "/static/**");
    }
   
}
