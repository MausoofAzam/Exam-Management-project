package com.snort.controller;

import com.snort.dto.QuestionRequest;
import com.snort.entities.Question;
import com.snort.entities.User;
import com.snort.repository.OptionRepository;
import com.snort.repository.UserRepository;
import com.snort.service.QuestionService;
import com.snort.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    @Autowired
    private UserService userService;
    @ModelAttribute
    public void addCommonData(Model model, Principal principal) {

        String userName = principal.getName();
        System.out.println("USERNAME :" + userName);

        User user = userRepository.getUserByUserName(userName);
//        System.out.println("USER :" + user);
        model.addAttribute("user", user);

    }
    @GetMapping("/index")
    public String adminDashBoard(Model model) {
        model.addAttribute("title", "Admin Dashboard");
        return "admin/admin_home";
    }

    /* This handle is for fetching all users*/
    @GetMapping("/show-users")
    public String showAllUsers(Model model) {
        List<User> userList = userRepository.findAll();
        model.addAttribute("userList", userList);
        model.addAttribute("title", "Show User List");
        return "admin/user-list";
    }
    /*This Handler is used for all users except users has ROLE ADMIN*/
  /*  @GetMapping("/show-users")
    public String showAllUsers(Model model, Principal principal) {
        List<User> userList = userRepository.findAllByUsernameNot(principal.getName());
        model.addAttribute("userList", userList);
        model.addAttribute("title", "Show User List");
        return "admin/user-list";
    }
*/

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
        System.out.println("created Question: " + question);
        return "admin/create_question";
    }

    /*Handler for delete users*/
    @GetMapping("/deleteUser/{id}")
    public String deleteUser(@PathVariable(value = "id") int id) {
        Optional<User> optionalUser = this.userRepository.findById(id);
        User user = optionalUser.get();
        System.out.println("Deleted User :" + user);
        this.userRepository.delete(user);
        return "redirect:admin/user-list";
    }

    @GetMapping("/search")
    public ModelAndView searchBy(HttpServletRequest request) {
        ModelAndView view = new ModelAndView("admin/user-list");
        String optionName = request.getParameter("optionName").trim();
        String optionValue = request.getParameter("optionValue").trim();
        List<User> userList = new ArrayList<>();

        switch (optionName) {
            case "name": {
                userList = userRepository.findByName(optionValue);
                System.out.println("userList : " + userList);
            }
            break;
            case "email": {
                userList = userRepository.findByEmail(optionValue);
                System.out.println("userList : " + userList);

            }
            break;
            default:
                break;
        }
        view.addObject("userList", userList);
        return view;
    }

    /*Handler for getting exam page based on category level and set number*/
    @GetMapping("/mcq/exam12")
    public String startExam1(Model model) {
        model.addAttribute("title","Assign the List of Questions Here");
        return "admin/startExamsDemo";
    }

    @GetMapping("/mcq/examsList")
    public String startExam(Model model, @RequestParam(required = false, name = "category") String category,
                            @RequestParam(required = false, name = "level") String level, @RequestParam(required = false, name = "setNumber") Integer setNumber) {
        if (category != null && level != null && setNumber != null) {
            List<Question> questions = questionService.findQusByCategoryAndLevelAndSetNumber(category, level, setNumber);
            model.addAttribute("title", "List of Questions");
            System.out.println("List of Question : " + questions);
            model.addAttribute("questions", questions);
            model.addAttribute("totalCount", questionService.countByCategoryAndLevelAndSetNumber(category, level, setNumber));
            model.addAttribute("totalMarks", questionService.addMarksByCategoryAndLevelAndSetNumber(category, level, setNumber));
            return "admin/assign_exam";
        } else {
            return "admin/startExamsDemo";
        }
    }


}
