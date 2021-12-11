package pack.cfg;

import org.springframework.security.web.context.AbstractSecurityWebApplicationInitializer;

public class SecInit extends AbstractSecurityWebApplicationInitializer {

    @Override
    protected boolean enableHttpSessionEventPublisher() {
        return true;
    }


}
