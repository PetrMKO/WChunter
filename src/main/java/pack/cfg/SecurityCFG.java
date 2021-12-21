package pack.cfg;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import pack.auth.UserEntityDetailsService;
import pack.entity.UserEntity;
import pack.repo.UserRepo;

import javax.sql.DataSource;

@Configuration
@EnableWebSecurity
public class SecurityCFG extends WebSecurityConfigurerAdapter {


    @Autowired
    private DataSource dataSource;
    @Autowired
    private UserRepo userRepo;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                    .antMatchers("/first").permitAll()
                    .antMatchers("/reg").permitAll()
                    .antMatchers("/resources/css/{style}.css").permitAll()
                    .antMatchers("/resources/css/{style}.png").permitAll()
                    .antMatchers("/resources/**").permitAll()
                    .antMatchers("/test").permitAll()
                    .antMatchers("/map").hasAnyRole("MODERATOR","USER")
                    .antMatchers("/points").permitAll()
                    .antMatchers("/point/**").permitAll()
                    .antMatchers("/login").permitAll()
                    .antMatchers("/lk").hasAnyRole("MODERATOR","USER")
                    .antMatchers("/test").permitAll()
                    .antMatchers(HttpMethod.POST, "/test").permitAll()
                    .anyRequest().permitAll()
                .and()
                    .formLogin(form -> form.loginPage("/loginka")
                                        .defaultSuccessUrl("/lk", true)
                                        .loginProcessingUrl("/login")
                                        .usernameParameter("login"))
                            .logout().permitAll().and().csrf().disable();
    }

    @Override
    protected void configure(final AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(new UserEntityDetailsService(userRepo)).passwordEncoder(passwordEncoder());
    }



    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

}
