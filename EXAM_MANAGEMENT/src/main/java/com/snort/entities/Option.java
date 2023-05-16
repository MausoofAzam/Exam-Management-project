package com.snort.entities;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "option_db")
public class Option {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    //    @OneToOne(mappedBy = "question", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
//    @JoinColumn(name = "question_id")
  /*  @OneToOne
    @JoinColumn(name = "question_id")
    private Question question;*/
    private String option1;
    private String option2;
    private String option3;
    private String option4;
    private String title;
   /* @Transient
    private Boolean correctAnswer;
*/


}