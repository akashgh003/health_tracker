# 🏋️‍♂️ Fitness Tracker 🚀
Welcome to Fitness Tracker Pro - Your Ultimate Workout Companion! 💪

## 🌟 Features
- 📊 Track multiple workout types
- 👥 Multi-user support
- 📈 Interactive statistics and visualizations
- 🌓 Dark/Light theme support
- 💾 Local storage persistence
- 📱 Responsive design
  
## 🛠️ Tech Stack
- Angular 15
- Chart.js
- TypeScript
- SCSS
- Karma/Jasmine for testing

## 🛠️ Unit Testing
- Comprehensive unit tests
- Used Karma/Jasmine for testing
![Unit Test Results](https://github.com/akashgh003/health_tracker/blob/main/localhost_9876__id%3D56915496%20(1).png)
  
## 🚀 Quick Start
1. **Install Dependencies**
```bash
npm install
```

# Fitness Tracker Flow Diagram
```mermaid
flowchart TD
    A[🏃‍♂️ Start App] --> B{📱 Choose View}
    
    B -->|Home View| C[➕ Add Workout]
    B -->|Stats View| D[📊 View Statistics]
    
    C --> E[Enter User Details]
    E --> F[Select Workout Type]
    F --> G[Enter Duration]
    G --> H[Save Workout]
    H --> I[💾 Update Storage]
    I --> B
    
    D --> J[Select User]
    J --> K{Choose View Type}
    K -->|Bar Chart| L[📊 View Bar Chart]
    K -->|Circular| M[🔄 View Progress Ring]
    
    L --> N[View Workout Minutes]
    M --> N
    N --> O[🔍 Filter/Search]
    O --> B
    style A fill:#ff9900,stroke:#ff6600,stroke-width:2px
    style B fill:#3498db,stroke:#2980b9,stroke-width:2px
    style D fill:#2ecc71,stroke:#27ae60,stroke-width:2px
    style C fill:#e74c3c,stroke:#c0392b,stroke-width:2px
    style H fill:#9b59b6,stroke:#8e44ad,stroke-width:2px
    style K fill:#f1c40f,stroke:#f39c12,stroke-width:2px
