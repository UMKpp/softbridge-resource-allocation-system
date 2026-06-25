# ER Diagram

This ERD is generated from the current JPA entities in `src/main/java/com/softbridge/sras/model`.

The `Project.projectManager` relationship is stored as a many-to-one foreign key to `Employee`. The service layer enforces the business rule that one PM can only be assigned to one project.

```mermaid
erDiagram
    EMPLOYEE ||--o{ EMPLOYEE_SKILL : has
    SKILL ||--o{ EMPLOYEE_SKILL : describes
    EMPLOYEE ||--o{ PROJECT : manages
    PROJECT ||--o{ EMPLOYEE_PROJECT_ASSIGNMENT : contains
    EMPLOYEE ||--o{ EMPLOYEE_PROJECT_ASSIGNMENT : assigned_employee
    EMPLOYEE ||--o{ EMPLOYEE_PROJECT_ASSIGNMENT : assigned_by
    PROJECT ||--o{ PROJECT_ALLOCATION : has
    EMPLOYEE ||--o{ PROJECT_ALLOCATION : allocated

    EMPLOYEE {
        string employee_id PK
        string username
        string password
        string fullName
        string email
        string department
        string jobRole
        string userType
    }

    SKILL {
        long skill_id PK
        string skill_name
        string skill_category
    }

    EMPLOYEE_SKILL {
        long id PK
        string employee_id FK
        long skill_id FK
        int skillLevel
    }

    PROJECT {
        long projectId PK
        string projectName
        string clientName
        string description
        string status
        string project_manager_id FK
        string requiredSkillName
        int requiredSkillLevel
    }

    EMPLOYEE_PROJECT_ASSIGNMENT {
        long id PK
        long project_id FK
        string employee_id FK
        string role
        string assigned_by FK
        string status
    }

    PROJECT_ALLOCATION {
        long allocationId PK
        long project_id FK
        string employee_id FK
        string allocatedRole
        date allocationDate
    }
```
