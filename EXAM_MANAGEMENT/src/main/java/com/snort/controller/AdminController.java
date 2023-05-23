package com.snort.controller;

import com.snort.dto.QuestionRequest;
import com.snort.entities.Contact;
import com.snort.entities.Question;
import com.snort.entities.User;
import com.snort.repository.ContactRepository;
import com.snort.repository.OptionRepository;
import com.snort.repository.UserRepository;
import com.snort.service.QuestionService;
import com.snort.service.UserQuestionService;
import com.snort.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
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
    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private UserQuestionService userQuestionService;

    @ModelAttribute
    public void addCommonData(Model model, Principal principal) {

        String userName = principal.getName();
        System.out.println("USERNAME :" + userName);

        User user = userRepository.getUserByUserName(userName);
        System.out.println("USER :" + user);
        model.addAttribute("user", user);

    }

    @GetMapping("/index")
    public String adminDashBoard(Model model) {
        model.addAttribute("title", "Admin Dashboard");
        return "admin/admin_home";
    }

    /* This handle is for fetching all users*/
  /*  @GetMapping("/show-users")
    public String showAllUsers(Model model) {
        List<User> userList = userRepository.findAll();
        model.addAttribute("userList", userList);
        model.addAttribute("title", "Show User List");
        return "admin/user-list";
    }*/
    /*This Handler is used for all users except users has ROLE ADMIN*/
    @GetMapping("/show-users")
    public String showAllUsers(Model model) {
        List<User> userList = userRepository.findAll();
        List<User> nonAdminUser = userList.stream().filter(user -> !user.getRole().equals("ROLE_ADMIN")).collect(Collectors.toList());
        model.addAttribute("userList", nonAdminUser);
        model.addAttribute("title", "Show User List");
        return "admin/user-list";
    }

    @GetMapping("/add-contact")
    public String openAddContactForm(Model model) {

        model.addAttribute("title", "Add Contact");
        model.addAttribute("contact", new Contact());
        return "admin/add_contact_form";
    }

    @PostMapping("/process-contact")
    public String processContact(@ModelAttribute Contact contact, @RequestParam("profileImage") MultipartFile file,
                                 Principal principal, HttpSession session) {
        try {
            String name = principal.getName();
            User user = this.userRepository.getUserByUserName(name);

            if (file.isEmpty()) {
                System.out.println("File is Empty");
//                contact.setImage("contact1.png");

            } else {
                contact.setImage(file.getOriginalFilename());

                File saveFile = new ClassPathResource("static/image").getFile();

                Path path = Paths.get(saveFile.getAbsolutePath() + File.separator + file.getOriginalFilename());

                Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

                System.out.println("Image is Uploaded");
            }

            contact.setUser(user);

            user.getContacts().add(contact);
            this.userRepository.save(user);

            System.out.println("Contact :" + contact);

            System.out.println("Added to Database");

//            session.setAttribute("message", new Message("Your Contact Is Added !! Add More", "success"));

        } catch (Exception e) {
            e.printStackTrace();

//            session.setAttribute("message", new Message("Something Went Wrong !! Try Again", "danger"));
        }
        return "admin/add_contact_form";
    }

    @GetMapping("/show-contacts")
    public String showContact(Model model, Principal principal) {
        model.addAttribute("title", "Show User Contacts");
        String userName = principal.getName();
        User user = this.userRepository.getUserByUserName(userName);
        List<Contact> contacts = this.contactRepository.findContactByUser(user.getId());
        model.addAttribute("contacts", contacts);
        return "admin/show_contacts";
    }

    /*Handler for */
    @GetMapping("/profile")
    public String yourProfile(Model model) {

        model.addAttribute("title", "Profile");

        return "admin/profile";
    }

    /*handler for opening create_question page*/
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
    /*Handler for saving question*/
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

    /*Handler for Search */
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
//                userList = userRepository.findByEmail(optionValue);
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
    @GetMapping("/mcq/exam12/{userId}")
    public String startExam1(@PathVariable Long userId, Model model) {
        model.addAttribute("title", "Assign the List of Questions Here");
        model.addAttribute("userId", userId);
        return "admin/startExamsDemo";
    }

/*Handler for Showing the List of Question to the Admin/TL based on Category,Level and description*/
    @GetMapping("/mcq/examsList")
    public String startExam(Model model,
                            @RequestParam(required = false, name = "category") String category,
                            @RequestParam(required = false, name = "level") String level,
                            @RequestParam(required = false, name = "setNumber") Integer setNumber,
                            @RequestParam(required = false, name = "userId") Integer userId) {
        if (category != null && level != null && setNumber != null) {
            List<Question> questions = questionService.findQusByCategoryAndLevelAndSetNumber(category, level, setNumber);
            model.addAttribute("title", "List of Questions");
            System.out.println("List of Questions: " + questions);
            model.addAttribute("category", category);
            model.addAttribute("level", level);
            model.addAttribute("setNumber", setNumber);
            model.addAttribute("userId", userId);
            model.addAttribute("questions", questions);
            model.addAttribute("totalCount", questionService.countByCategoryAndLevelAndSetNumber(category, level, setNumber));
            model.addAttribute("totalMarks", questionService.addMarksByCategoryAndLevelAndSetNumber(category, level, setNumber));
            System.out.println("Questions assigned");
            return "admin/assign_exam";
        } else {
            return "admin/startExamsDemo";
        }
    }

    /*this is rest Api to check from postman*/

 /*   @PostMapping("/assign/{userId}/{category}/{level}/{setNumber}")
    public ResponseEntity<?> assignQuestionsToUser(@PathVariable Long userId,
                                                   @PathVariable String category,
                                                   @PathVariable String level,
                                                   @PathVariable Integer setNumber) {
        userQuestionService.assignQuestionsToUser(userId, category, level, setNumber);
        return ResponseEntity.ok().build();
    }*/
/*This assignQuestionsToUser handler is used to assign the Question to the particular user*/
    @PostMapping("/assign-question")
    public String assignQuestionsToUser(@RequestParam int userId,
                                        @RequestParam String category,
                                        @RequestParam String level,
                                        @RequestParam Integer setNumber) {
        System.out.println("userId :" + userId);
        System.out.println("category : " + category);
        System.out.println("level : " + level);
        System.out.println("setNumber : " + setNumber);
        userQuestionService.assignQuestionsToUser(userId, category, level, setNumber);
        return "admin/assigned_success";
    }


}
