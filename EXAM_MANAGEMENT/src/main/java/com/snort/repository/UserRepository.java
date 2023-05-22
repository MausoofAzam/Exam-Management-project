package com.snort.repository;

import com.snort.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {
    @Query("select u from User u where u.email = :email")
    public User getUserByUserName(@Param("email") String email);


    public List<User> findByName(String name);

    public User findByEmail(String email);

//    List<User> findAllByUsernameNot(String name);
  /*  @Query("SELECT u FROM User u WHERE u.role <> 'ADMIN'")
    List<User> findAllNonAdminUsers();*/
}
