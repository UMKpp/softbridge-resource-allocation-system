package com.softbridge.sras.config;

import com.softbridge.sras.model.Employee;
import com.softbridge.sras.model.EmployeeSkill;
import com.softbridge.sras.model.Project;
import com.softbridge.sras.model.ProjectAllocation;
import com.softbridge.sras.model.Skill;
import com.softbridge.sras.repository.EmployeeRepository;
import com.softbridge.sras.repository.EmployeeSkillRepository;
import com.softbridge.sras.repository.ProjectAllocationRepository;
import com.softbridge.sras.repository.ProjectRepository;
import com.softbridge.sras.repository.SkillRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final SkillRepository skillRepository;
    private final EmployeeSkillRepository employeeSkillRepository;
    private final ProjectRepository projectRepository;
    private final ProjectAllocationRepository projectAllocationRepository;

    public DataSeeder(EmployeeRepository employeeRepository,
                      SkillRepository skillRepository,
                      EmployeeSkillRepository employeeSkillRepository,
                      ProjectRepository projectRepository,
                      ProjectAllocationRepository projectAllocationRepository) {
        this.employeeRepository = employeeRepository;
        this.skillRepository = skillRepository;
        this.employeeSkillRepository = employeeSkillRepository;
        this.projectRepository = projectRepository;
        this.projectAllocationRepository = projectAllocationRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {

        if (employeeRepository.count() > 0) {
            return;
        }

        Random random = new Random();

        List<Skill> skills = new ArrayList<>();

        skills.add(createSkill("Java", "Programming Languages"));
        skills.add(createSkill("Spring Boot", "Backend"));
        skills.add(createSkill("REST API Development", "Backend"));
        skills.add(createSkill("MySQL", "Database"));
        skills.add(createSkill("React Native", "Mobile"));
        skills.add(createSkill("Flutter", "Mobile"));
        skills.add(createSkill("Kotlin", "Programming Languages"));
        skills.add(createSkill("Swift", "Programming Languages"));
        skills.add(createSkill("UI/UX Design", "Design"));
        skills.add(createSkill("Figma", "Design"));
        skills.add(createSkill("QA Testing", "Testing"));
        skills.add(createSkill("Mobile App Testing", "Testing"));
        skills.add(createSkill("Git", "DevOps"));
        skills.add(createSkill("AWS", "DevOps"));
        skills.add(createSkill("Docker", "DevOps"));

        skillRepository.saveAll(skills);

        List<Project> projects = new ArrayList<>();

        projects.add(createProject("FashionBub Mobile Shopping App", "FashionBub Ltd.", "A mobile app for fashion e-commerce.", "PLANNING"));
        projects.add(createProject("Heladiwa Tours Booking System", "Heladiwa Tours", "Online booking platform for tours.", "PLANNING"));
        projects.add(createProject("EduSmart Learning Platform", "EduSmart Inc.", "Adaptive learning management system.", "PLANNING"));
        projects.add(createProject("FinTrack Expense Manager", "FinTrack LLC", "Personal finance tracking application.", "PLANNING"));
        projects.add(createProject("SoftCare Hospital Management System", "SoftCare Health", "Comprehensive hospital administration suite.", "PLANNING"));
        projects.add(createProject("DataForge Analytics Dashboard", "DataForge Co.", "Business intelligence dashboard.", "PLANNING"));
        projects.add(createProject("GreenEnergy IoT Platform", "GreenEnergy Ltd.", "IoT monitoring for renewable energy.", "PLANNING"));
        projects.add(createProject("SecurePay Payment Gateway", "SecurePay Corp.", "Online payment processing service.", "PLANNING"));
        projects.add(createProject("TravelMate Recommendation Engine", "TravelMate", "AI-driven travel recommendation system.", "PLANNING"));
        projects.add(createProject("HealthFit Wearable Sync", "HealthFit", "Synchronization service for health wearables.", "PLANNING"));

        projectRepository.saveAll(projects);

        List<String> firstNames = List.of(
                "john", "nimal", "kasun", "amila", "sahan",
                "dinesh", "ravindu", "tharindu", "ashan", "kavindu",
                "charith", "supun", "malith", "isuru", "gayan",
                "lahiru", "pasindu", "shehan", "duminda", "roshan",
                "emma", "sarah", "olivia", "sophia", "isabella",
                "mia", "amara", "nethmi", "sanduni", "piumi",
                "fiona", "rachel", "hannah", "jane", "lisa",
                "ayesha", "shalini", "dinushi", "sachini", "upeksha",
                "daniel", "michael", "david", "james", "kevin",
                "brian", "steven", "andrew", "ryan", "jason",
                "aruni", "thilini", "madusha", "kavya", "ishara",
                "nadeesha", "sewmini", "hiruni", "chamodi", "dilini",
                "oshan", "thanuka", "vishwa", "janith", "sandeepa",
                "madhawa", "akila", "hashan", "ramesh", "nuwan",
                "yasiru", "sajith", "chathura", "navin", "milinda",
                "hasini", "manori", "nuwani", "imasha", "kaushalya",
                "sithara", "anushka", "rashmi", "devmi", "ishani",
                "melani", "oshadi", "dinuka", "tharushi", "pramodi",
                "sameera", "lahirun", "chamara", "nipun", "sachith",
                "tharush", "gimhana", "kalana", "yohan", "eranda"
        );

        List<String> lastNames = List.of(
                "Perera", "Silva", "Fernando", "Jayasinghe", "Bandara",
                "Dias", "Gunawardena", "Wijesinghe", "Karunaratne", "De Silva",
                "Abeysekara", "Rathnayake", "Ekanayake", "Herath", "Rajapaksha",
                "Samarasinghe", "Ranasinghe", "Wickramasinghe", "Amarasinghe",
                "Senanayake", "Madushanka", "Liyanage", "Pathirana",
                "Kumara", "Mendis"
        );

        List<String> jobRoles = List.of(
                "Backend Developer",
                "Frontend Developer",
                "Full Stack Developer",
                "Mobile Developer",
                "QA Engineer",
                "DevOps Engineer",
                "UI/UX Designer",
                "Business Analyst",
                "Data Engineer"
        );

        List<String> departments = List.of(
                "Engineering",
                "Quality Assurance",
                "DevOps",
                "UI/UX",
                "Business Analysis",
                "Data Engineering"
        );

        List<Employee> employees = new ArrayList<>();

        for (int i = 1; i <= 100; i++) {

            String employeeId = String.format("SB%04d", i);
            String firstName = firstNames.get(i - 1);
            String lastName = lastNames.get(random.nextInt(lastNames.size()));
            String username = firstName + String.format("%04d", i);
            String email = username + "@softbridge.com";

            String userType;
            String jobRole;
            String department;

            if (i <= 80) {
                userType = "EMPLOYEE";
                jobRole = jobRoles.get(random.nextInt(jobRoles.size()));
                department = departments.get(random.nextInt(departments.size()));
            } else if (i <= 90) {
                userType = "PROJECT_MANAGER";
                jobRole = "Project Manager";
                department = "Project Management";
            } else if (i <= 95) {
                userType = "HR";
                jobRole = "HR Manager";
                department = "Human Resources";
            } else {
                userType = "ADMIN";
                jobRole = "Admin";
                department = "Administration";
            }

            Employee employee = new Employee();
            employee.setEmployeeId(employeeId);
            employee.setUsername(username);
            employee.setPassword("SoftBridge@123");
            employee.setFullName(capitalize(firstName) + " " + lastName);
            employee.setEmail(email);
            employee.setDepartment(department);
            employee.setJobRole(jobRole);
            employee.setUserType(userType);

            employees.add(employee);
        }

        employeeRepository.saveAll(employees);

        List<Skill> savedSkills = skillRepository.findAll();
        List<EmployeeSkill> employeeSkills = new ArrayList<>();

        for (Employee employee : employees) {

            int skillCount = 2 + random.nextInt(4);
            Set<Integer> usedSkillIndexes = new HashSet<>();

            while (usedSkillIndexes.size() < skillCount) {
                int skillIndex = random.nextInt(savedSkills.size());

                if (usedSkillIndexes.add(skillIndex)) {
                    EmployeeSkill employeeSkill = new EmployeeSkill();
                    employeeSkill.setEmployee(employee);
                    employeeSkill.setSkill(savedSkills.get(skillIndex));
                    employeeSkill.setSkillLevel(1 + random.nextInt(3));

                    employeeSkills.add(employeeSkill);
                }
            }
        }

        employeeSkillRepository.saveAll(employeeSkills);

        List<Project> savedProjects = projectRepository.findAll();
        List<ProjectAllocation> allocations = new ArrayList<>();
        Set<String> allocationKeys = new HashSet<>();

        while (allocations.size() < 20) {

            Employee employee = employees.get(random.nextInt(employees.size()));
            Project project = savedProjects.get(random.nextInt(savedProjects.size()));

            String key = employee.getEmployeeId() + "-" + project.getProjectId();

            if (allocationKeys.add(key)) {
                ProjectAllocation allocation = new ProjectAllocation();
                allocation.setEmployee(employee);
                allocation.setProject(project);
                allocation.setAllocatedRole(employee.getJobRole());
                allocation.setAllocationDate(LocalDate.now().minusDays(random.nextInt(30)));

                allocations.add(allocation);
            }
        }

        projectAllocationRepository.saveAll(allocations);

        System.out.println("Demo data seeded successfully!");
    }

    private Skill createSkill(String skillName, String skillCategory) {
        Skill skill = new Skill();
        skill.setSkillName(skillName);
        skill.setSkillCategory(skillCategory);
        return skill;
    }

    private Project createProject(String projectName,
                                  String clientName,
                                  String description,
                                  String status) {
        Project project = new Project();
        project.setProjectName(projectName);
        project.setClientName(clientName);
        project.setDescription(description);
        project.setStatus(status);
        return project;
    }

    private String capitalize(String value) {
        return value.substring(0, 1).toUpperCase() + value.substring(1);
    }
}