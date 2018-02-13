package com.gms.repository.security.user;

import com.gms.domain.security.user.EUser;
import com.gms.util.constant.Resource;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * EUserRepository
 *
 * @author Asiel Leal Celdeiro | lealceldeiro@gmail.com
 *
 * @version 0.1
 * Dec 12, 2017
 */
@RepositoryRestResource(collectionResourceRel = Resource.USER_PATH, path = Resource.USER_PATH)
public interface EUserRepository extends EUserRepositoryCustom, PagingAndSortingRepository<EUser, Long> {

    EUser findFirstByUsernameOrEmail(String username, String email);

    EUser findFirstByUsername(String username);

    @Override
    <S extends EUser> S save(S s);

    @Override
    <S extends EUser> Iterable<S> save(Iterable<S> it);
}
