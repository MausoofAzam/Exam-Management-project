package com.snort.controller;

import com.snort.entities.Contact;
import com.snort.entities.User;
import com.snort.helper.Message;
import com.snort.repository.ContactRepository;
import com.snort.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.Banner;
import org.springframework.core.io.ClassPathResource;
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

@Controller
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ContactRepository contactRepository;

    @ModelAttribute
    public void addCommonData(Model model, Principal principal) {

        String userName = principal.getName();
        System.out.println("USERNAME :" + userName);

        User user = userRepository.getUserByUserName(userName);
//        System.out.println("USER :" + user);
        model.addAttribute("user", user);

    }

    @RequestMapping("/index")
    public String dashboard(Model model, Principal principal) {
        model.addAttribute("title", "User Dashboard");

        return "normal/user_dashboard";
    }

    // open add form handler
    @GetMapping("/add-contact")
    public String openAddContactForm(Model model) {

        model.addAttribute("title", "Add Contact");
        model.addAttribute("contact", new Contact());
        return "normal/add_contact_form";
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
        return "normal/add_contact_form";
    }

    /* Show contact Handler*/
    @GetMapping("/show-contacts")
    public String showContact(Model model, Principal principal) {
        model.addAttribute("title", "Show User Contacts");
        String userName = principal.getName();
        User user = this.userRepository.getUserByUserName(userName);
        List<Contact> contacts = this.contactRepository.findContactByUser(user.getId());
        model.addAttribute("contacts", contacts);
        return "normal/show_contacts";
    }

    @GetMapping("/delete/{cid}")
    public String deleteContact(@PathVariable("cid") Integer cId, Model model, HttpSession session, Principal principal) {
        System.out.println("CID :" + cId);
        Contact contact = this.contactRepository.findById(cId).get();

        System.out.println("Contact :" + contact.getCId());

        contact.setUser(null);
        this.contactRepository.delete(contact);

        User user = this.userRepository.getUserByUserName(principal.getName());

        user.getContacts().remove(contact);

        this.userRepository.save(user);

        System.out.println("Contact Deleted");
        session.setAttribute("message", new Message("Contact Deleted Successfully!!", "success"));

        return "redirect:/user/show-contacts";
    }

    //update for Handler
    @PostMapping("/open-contact/{cId}")
    public String updateForm(@PathVariable("cId") int cId, Model model) {
        Contact contact = this.contactRepository.findById(cId).get();
        model.addAttribute("title", "Update-Contact");
        model.addAttribute("contact", contact);
        return "normal/update_form";
    }

    //update contact handler
    @PostMapping("/process-update")
    public String updateHandler(@ModelAttribute Contact contact, /*@RequestParam("profileImage") MultipartFile file,*/
                                Model m, HttpSession session, Principal principal) {

        try {

            Contact oldContactDetail = this.contactRepository.findById(contact.getCId()).get();

            /*if(!file.isEmpty()) {

                File deleteFile = new ClassPathResource("static/img").getFile();
                File file1=new File(deleteFile, oldContactDetail.getImage());
                file1.delete();


                File saveFile = new ClassPathResource("static/img").getFile();

                Path path = Paths.get(saveFile.getAbsolutePath()+File.separator+file.getOriginalFilename());

                Files.copy(file.getInputStream(),path, StandardCopyOption.REPLACE_EXISTING);

                contact.setImage(file.getOriginalFilename());


            }else {

                contact.setImage(oldContactDetail.getImage());

            }*/
            User user = this.userRepository.getUserByUserName(principal.getName());

            contact.setUser(user);

            this.contactRepository.save(contact);

//            session.setAttribute("message", new Message("Your Contact Is Updated","success"));

        } catch (Exception e) {
            e.printStackTrace();
        }

//        return "redirect:/user/"+contact.getCId()+"/contact";
        return "redirect:normal/show_contacts";

    }

    //handler for profile
    @GetMapping("/profile")
    public String yourProfile(Model model) {

        model.addAttribute("title", "Profile");

        return "normal/profile";
    }

    @GetMapping("/search")
    public ModelAndView searchBy(HttpServletRequest request) {
        ModelAndView view = new ModelAndView("normal/show_contacts");
        String optionName = request.getParameter("optionName").trim();
        String optionValue = request.getParameter("optionValue").trim();

        List<Contact> contactList = new ArrayList<>();

        switch (optionName) {
            case "name": {
                contactList = contactRepository.findByName(optionValue);
                System.out.println("contactList : " + contactList);
            }
            break;
            case "email": {
                contactList = contactRepository.findByEmail(optionValue);
                System.out.println("contactList : " + contactList);

            }
            break;
            case "phone": {
                contactList = contactRepository.findByPhone(optionValue);
                System.out.println("contactList : " + contactList);
            }
            break;
            default:
                break;
        }
        view.addObject("contactList", contactList);
        return view;
    }

}
