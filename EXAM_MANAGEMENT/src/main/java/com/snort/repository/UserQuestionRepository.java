package com.snort.repository;

import com.snort.entities.UserQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserQuestionRepository extends JpaRepository<UserQuestion,Long> {
    List<UserQuestion> findByUserId(Long userId);
}
