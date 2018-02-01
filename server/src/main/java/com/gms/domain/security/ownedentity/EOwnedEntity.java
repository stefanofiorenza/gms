package com.gms.domain.security.ownedentity;

import com.gms.domain.GmsEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * EOwnedEntity
 *
 * @author Asiel Leal Celdeiro | lealceldeiro@gmail.com
 *
 * @version 0.1
 * Dec 12, 2017
 */
@Data
@NoArgsConstructor(force = true)
@RequiredArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
public class EOwnedEntity extends GmsEntity{

    /**
     * Natural name which is used commonly for referring to the entity.
     */
    @NotNull(message = "validation.field.notNull")
    @NotBlank(message = "validation.field.notBlank")
    @Size(max = 255, message = "validation.field.size")
    @Column(nullable = false, length = 255)
    private final String name;

    /**
     * A unique string representation of the {@link #name}. Useful when there are other entities with the same {@link #name}.
     */
    @NotNull(message = "validation.field.notNull")
    @NotBlank(message = "validation.field.notBlank")
    @Column(unique = true, nullable = false)
    private final String username;

    /**
     * A brief description of the entity.
     */
    @NotNull(message = "validation.field.notNull")
    @NotBlank(message = "validation.field.notBlank")
    @Size(max = 10485760, message = "validation.field.size")
    @Column(length = 10485760, nullable = false)
    private final String description;

}
