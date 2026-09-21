# 🗓️ CT Exam Dashboard

> 🌐 **Live Website:** [Open CT Exam Dashboard](PASTE_YOUR_NETLIFY_URL_HERE)

A simple and interactive dashboard for managing CT exam schedules, teachers, topics, countdowns, calendar views, and course-wise exam information.

---

## 🚀 How to Open the Website

The website is already hosted on **Netlify**, so no installation or setup is required.

1. Open the **Live Website** link above.
2. The dashboard will load directly in your browser.
3. You can manage CT information from the website itself.

> 💡 For the best experience, keep using the same browser and the same Netlify website address.

---

## 🌙 Switch Between Light & Dark Themes

- Click the **moon / sun button** in the upper-right corner.
- The website will instantly switch between **Light Mode** and **Dark Mode**.
- Your selected theme is saved in the browser, so it will stay the same after refreshing the page.
- The **“Dhaka · date”** text is hidden from the **Next CT** card.

---

## ✏️ Change CT Date, Teacher & Exam Topics

1. Click the **Manage CTs** button in the upper-right corner.
2. In **Filter CT Cards**, select:
   - **All Courses**
   - **DSP**
   - **CWC**
   - **DSA**
   - **CCS**
   - **ML**
3. Find the CT you want to edit.
4. Update any of the following:
   - 📅 **Date**
   - 👨‍🏫 **Teacher / Sir**
   - 📚 **Exam Topics**
5. For multiple topics, separate them using **commas** or **new lines**.
6. Click **Save Changes**.

When a course filter is selected, only CT cards from that course will be shown. Switching between filters will not remove your unsaved edits.

After saving, the following sections update automatically:

- ⏳ **Next CT**
- ⏱️ **Countdown**
- 🛣️ **Timeline**
- 📆 **Calendar**
- 📊 **Progress**
- 🗓️ **Month Filter**

The teacher's name will also appear on the exam card.

👉 Click an exam card to **show or hide its topics**.

---

## ➕ Add a New CT

1. Open the **Manage CTs** panel.
2. Go to **Add a New CT**.
3. Enter:
   - Course
   - CT Number
   - Date
   - Teacher's Name
   - Exam Topics
4. Click **+ Add CT**.
5. Click **Save Changes**.

---

## 🗑️ Delete a CT

1. Open **Manage CTs**.
2. Click **Delete** beside the CT you want to remove.
3. Click **Save Changes**.

---

## ♻️ Restore the Default Schedule

1. Open **Manage CTs**.
2. Click **Restore Defaults**.
3. Click **Save Changes**.

This restores the original/default CT schedule stored in the website.

---

## ⚠️ Important Information

### 💾 Browser Storage

All changes made from the website are saved in your browser's **local storage**.

This means:

- Your changes remain available after refreshing the page.
- Your saved data is tied to the browser and the website address you are using.
- Clearing browser/site data may remove your saved CT changes.

### 👥 Changes Are Not Shared Automatically

Changes made from the **Manage CTs** panel are saved only in your own browser.

For example:

- If you change a CT date, the change appears for **you**.
- Another person opening the website from their browser will still see the website's default schedule.

To make a schedule change visible to **everyone**, the default schedule in the website source must be updated and the updated version must be deployed to **Netlify** again.

### 📅 Multiple CTs on the Same Day

If multiple CT exams are scheduled on the same date, all of them will appear together in the **Next CT countdown card**.

---

## 🌐 Netlify Deployment

The website is already deployed with **Netlify**.

If the website source code is updated later:

1. Update the required project files.
2. Redeploy the updated version to Netlify.
3. Open the same live website URL to view the latest deployed version.

---

## 📁 Project Files

The main website files are:

```text
index.html
style.css
script.js
```

Keep these files properly linked when editing or redeploying the project.

---

## ✅ Quick Summary

**Open Website → Manage CTs → Edit/Add/Delete CT → Save Changes**

No additional software installation is required for normal website use. 🎉
