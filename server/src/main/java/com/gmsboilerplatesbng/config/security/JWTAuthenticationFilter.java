package com.gmsboilerplatesbng.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gmsboilerplatesbng.domain.security.user.EUser;
import com.gmsboilerplatesbng.service.security.user.UserService;
import com.gmsboilerplatesbng.util.request.security.SecurityConst;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;

@RequiredArgsConstructor
public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final SecurityConst sc;

    private final AuthenticationManager authenticationManager;

    private final UserService userService;

    private final ObjectMapper oMapper;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest req, HttpServletResponse res) throws AuthenticationException {
        try {

            EUser credentials = new ObjectMapper().readValue(req.getInputStream(), EUser.class);
            String username = credentials.getUsername();
            String email = credentials.getEmail();
            HashSet<GrantedAuthority> authorities = this.userService.getUserAuthorities(
                    username != null ? username : email
            );

            return this.authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    credentials.getUsername(), credentials.getPassword(), authorities
            ));

        } catch (IOException e) { throw new RuntimeException(e); }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest req, HttpServletResponse res, FilterChain chain, Authentication authResult)
            throws IOException, ServletException {
        final Object[] authoritiesO = authResult.getAuthorities().toArray();
        String [] authoritiesS = new String[authoritiesO.length];
        for (int i = 0; i < authoritiesO.length; i++) {
            authoritiesS[i] = authoritiesO[i].toString();
        }
        long currentMillis = System.currentTimeMillis();
        long expiration = currentMillis + this.sc.EXPIRATION_TIME;
        String sub = ((EUser)authResult.getPrincipal()).getUsername();
        String jwt = Jwts.builder()
                .setSubject(sub)
                .setExpiration(new Date(expiration))
                .setIssuedAt(new Date(currentMillis))
                .signWith(SignatureAlgorithm.HS512, this.sc.SECRET.getBytes())
                .claim(this.sc.AUTHORITIES_HOLDER, authoritiesS)
                .claim(this.sc.EXPIRATION_HOLDER, expiration)
                .compact();

        res.setContentType(MediaType.APPLICATION_JSON_VALUE);

        HashMap<String, String> returnMap = new HashMap<>();
        returnMap.put(sc.USERNAME_HOLDER, sub);
        returnMap.put(sc.TOKEN_HOLDER, jwt);
        returnMap.put(sc.AUTHORITIES_HOLDER, oMapper.writeValueAsString(authoritiesS));
        returnMap.put(sc.TOKEN_TYPE_HOLDER, sc.TOKEN_TYPE);
        returnMap.put("header_to_be_sent", sc.HEADER);
        returnMap.put(sc.EXPIRATION_HOLDER, String.valueOf(expiration));
        returnMap.put(sc.ISSUED_TIME_HOLDER, String.valueOf(currentMillis));

        res.getOutputStream().println(oMapper.writeValueAsString(returnMap));
    }
}
