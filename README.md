# 🥘 Inventory Pal

<div align="center">


*Smart inventory management for the modern kitchen*

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://pantry-app-ncod.vercel.app)
[![Made with Next.js](https://img.shields.io/badge/Made%20with-Next.js-000000?style=flat&logo=Next.js&logoColor=white)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=flat&logo=material-ui&logoColor=white)](https://mui.com/)

[Features](#-key-features) • [Installation](#-installation-and-setup) • [Usage](#-usage-guide) • [Roadmap](#-future-improvements) • [Contributing](#-contributing)

</div>

## 📸 Project Showcase

<div align="center">
<img src="/public/IMG_2392.jpg" alt="Dashboard View" width="400"/>
<img src="/public/IMG_2394.jpg" alt="Dashboard View" width="400"/>
<img src="/public/IMG_2395.jpg" alt="Dashboard View" width="400"/>

</div>

## 🌟 Project Overview

Inventory Pal revolutionizes home cooking by offering a smart, intuitive inventory system. This CRUD application empowers users to effortlessly manage pantry items, monitor expiration dates, and generate creative recipes to minimize food waste.

### 🎯 Key Features

- 📦 **Item Management**: Seamlessly add, update, and remove pantry items
- 🔢 **Quantity Tracking**: Keep precise tabs on your ingredient stocks
- 📅 **Expiration Monitoring**: Never let food go to waste with date tracking
- 📸 **Image Uploads**: Visually catalog your pantry with item photos
- 🍳 **AI Recipe Generation**: Transform expiring ingredients into delicious meals
- 🔐 **Secure Authentication**: Keep your culinary data safe with Firebase

## 🛠 Technologies Used

- ⚛️ Next.js & React
- 🎨 Material-UI
- 🤖 Google Gemini API
- 🔥 Firebase

## 💻 Installation and Setup

1. Clone the culinary magic:
   ```bash
   git clone https://github.com/Ahmedayaz1210/pantry-app.git
   cd inventory-pal
   ```

2. Install the ingredients (dependencies):
   ```bash
   npm install
   ```

3. Add the special sauce (Material-UI):
   ```bash
   npm install @mui/material @emotion/react @emotion/styled
   ```
4. Environment Setup

Before running the project, you need to set up your own Firebase and Google Gemini API keys. Follow these steps:

a. Create a `.env.local` file in the root directory of the project.

b. Add the following environment variables to the `.env.local` file:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

   Replace `your_firebase_api_key` with your actual Firebase configuration values and `your_gemini_api_key` with your Google Gemini API key.

c. Save the file.

**Note:** Never commit your `.env.local` file to version control. It's already included in the `.gitignore` file to prevent accidental commits.
5. Fire up the kitchen (dev server):
   ```bash
   npm run dev
   ```

6. Visit `http://localhost:3000` and start cooking up a storm! 🌪️

## 📘 Usage Guide

1. **Sign Up/Login**: Create your chef's account 👨‍🍳👩‍🍳
2. **Add Items**: Stock your virtual pantry 🧺
3. **Manage Inventory**: Keep your ingredients fresh and organized 🗂
4. **Track Expiration**: Stay ahead of the freshness game ⏳
5. **Generate Recipes**: Turn almost-expired items into culinary masterpieces 🍽

## 💡 Challenges and Learnings

- Mastered the art of Firebase authentication, linking user accounts to their personal pantry data 🔐
- Skillfully integrated Google Gemini API, bringing AI-powered recipe creativity to your kitchen 🤖🍳

## 🚀 Future Improvements

1. 🔍 Implement a powerful search functionality
2. 📷 Add barcode scanning for lightning-fast item entry
3. 📅 Develop an intelligent meal planning system
4. 🔔 Set up smart notifications for expiring items
5. 🤝 Create a community feature for sharing recipes and tips

## 🤝 Contributing

Got ideas to make Inventory Pal even better? We'd love your input! Feel free to fork, improve, and submit a pull request. Let's cook up something amazing together! 🍲



---

<div align="center">

Author: Ahmed Ayaz :)

[⬆ Back to top](#-inventory-pal)

</div>
