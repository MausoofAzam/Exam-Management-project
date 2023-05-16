package com.snort.controller;

import com.snort.dto.QuestionRequest;
import com.snort.entities.Question;
import com.snort.entities.User;
import com.snort.repository.OptionRepository;
import com.snort.repository.UserRepository;
import com.snort.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
//@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private QuestionService questionService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OptionRepository optionRepository;

    @GetMapping("/index")
    public String adminDashBoard(Model model){
        model.addAttribute("title","Admin Dashboard");
        return "admin/admin_home";
    }
    @GetMapping("/show-users")

    public String showAllUsers(Model model ){
        List<User> userList= userRepository.findAll();
        model.addAttribute("userList",userList);
        model.addAttribute("title", "Show User List");
        return "admin/user-list";
    }

    @GetMapping("/createQuestion")
    public String showCreateQuestionForm(Model model) {
        model.addAttribute("title", new QuestionRequest());
        return "admin/create_question";
    }
 /*   @PostMapping("/mcq/saveQuestions")
    public Question createQuestion(@RequestBody QuestionRequest questionRequest) {
        Question question = questionService.createQuestion(questionRequest);
        return question;
    }*/
    @PostMapping("/saveQuestion")
    public String saveQuestion(@ModelAttribute("questionRequest") QuestionRequest questionRequest) {
        Question question = questionService.createQuestion(questionRequest);
        System.out.println("created Question: "+question);
        return "admin/create_question";
    }
    @GetMapping("/deleteUser/{id}")
    public String deleteUser(@PathVariable(value = "id") int id) {
        Optional<User>  optionalUser = this.userRepository.findById(id);
        User user = optionalUser.get();
        System.out.println("Deleted User :"+user);
        this.userRepository.delete(user);
        return "redirect:admin/user-list";
    }
    @DeleteMapping("/{id}")
    public String  delete(@PathVariable int id){
       try{
           userRepository.deleteById(id);
           return "user id "+id+" deleted successfully";
       }catch (Exception e){
           return "user id "+id+" cannot deleted";
       }
    }

}
