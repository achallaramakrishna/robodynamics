package com.robodynamics.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.view.InternalResourceViewResolver;


@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "com.robodynamics")
@PropertySource("classpath:app-config.properties")
public class AppConfig implements WebMvcConfigurer {
	
	@Autowired
    private Environment env;

    @Bean
    public InternalResourceViewResolver viewResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/views/");
        resolver.setSuffix(".jsp");
        return resolver;
    }

    @Bean(name = "multipartResolver")
    public CommonsMultipartResolver multipartResolver() {
        CommonsMultipartResolver resolver = new CommonsMultipartResolver();
        resolver.setMaxUploadSize(5242880); // 5MB
        return resolver;
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
    
}
