package com.snort.service;


import com.snort.dto.QuestionRequest;
import com.snort.entities.Option;
import com.snort.entities.Question;
import com.snort.repository.OptionRepository;
import com.snort.repository.QuestionRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private OptionRepository optionRepository;

    public Question createQuestion(QuestionRequest questionRequest){
        Question question = new Question(questionRequest);
        Option option = new Option();
        option.setOption1(questionRequest.getOption1());
        option.setOption2(questionRequest.getOption2());
        option.setOption3(questionRequest.getOption3());
        option.setOption4(questionRequest.getOption4());
        option.setTitle(questionRequest.getTitle());
        option = optionRepository.save(option);
        question.setOptions(option);
        question.setCategory(questionRequest.getCategory());
        question.setQuestionDescription(questionRequest.getQuestionDescription());
        question.setLevel(questionRequest.getLevel());
        question.setSetNumber(questionRequest.getSetNumber());
        question.setCorrectAnswer(questionRequest.getCorrectAnswer());
        question.setQuestionType(questionRequest.getQuestionType());
        question.setTotalMarks(questionRequest.getTotalMarks());
        question.setQuestionType(questionRequest.getQuestionType());

        questionRepository.save(question);
        return question;

    }

    public List<Question> findByCateoryAndLevel(String category, String level){
        List<Question> byCategoryAndLevel = questionRepository.findByCategoryAndLevel(category, level);
        return byCategoryAndLevel;
    }
    public List<Question> findAllQuestions(){
        List<Question> questionList = questionRepository.findAll();
        return questionList;
    }
    public void deleteQuestion(Long id){
        if (id!=null){
//            optionRepository.deleteById(id);
            questionRepository.deleteById(id);
        }
    }

    public List<Question> findBySetNumber(Integer setNumber){
        return questionRepository.findBySetNumber(setNumber);
    }
    public Integer countByCategoryAndLevelAndSetNumber(String category,String level,Integer setNumber){
        return questionRepository.countByCategoryAndLevelAndSetNumber(category,level,setNumber);
    }
    public Integer addMarksByCategoryAndLevelAndSetNumber(String category, String level, Integer setNumber){
        return questionRepository.sumByCategoryAndLevelAndSetNumber(category,level,setNumber);
    }
    public List<Question> findQusByCategoryAndLevelAndSetNumber(String category, String level, Integer setNumber){
        List<Question> questionList = questionRepository.findByCategoryAndLevelAndSetNumber(category, level, setNumber);
        return questionList;
    }
    public Page<Question> findQuestionsByCategoryAndLevelAndSetNumberPaginated(String category, String level, Integer setNumber, Pageable pageable) {
        return questionRepository.findByCategoryAndLevelAndSetNumber(category, level, setNumber, pageable);
    }
}
