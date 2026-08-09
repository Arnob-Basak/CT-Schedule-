# CT EXAM DASHBOARD — How to Change CT Details from the Website

## How to Run the Website

1. Extract the ZIP file.
2. Open the extracted folder and double-click the `index.html` file.
3. The website will open in your browser. No internet connection or software installation is required.

## How to Switch Between Light and Dark Themes

* Click the moon/sun button in the upper-right corner of the website.
* The website will immediately switch between Light and Dark themes.
* Your selected theme will be saved in the browser, so it will remain the same even after refreshing the page.
* The “Dhaka · date” text has been hidden from the Next CT card.

## How to Change the CT Date, Teacher’s Name, and Exam Topics

1. Click the **Manage CTs** button in the upper-right corner of the website.
2. In the **Filter CT Cards** section, select **All Courses** or a specific course: **DSP, CWC, DSA, CCS, or ML**.
3. Find the CT you want to edit and update its **Date**, **Teacher / Sir**, and **Exam Topics** fields.
4. You can separate multiple topics using commas or new lines.
5. Click the **Save Changes** button at the bottom.

When you select a course filter, only the CT cards for that course will be displayed. Your edited information will not be lost when you switch between filters.

After saving, the **Next CT, countdown, timeline, calendar, progress, and month filter** will update automatically. The teacher’s name will appear on the exam card. Click an exam card to show or hide its topics.

## How to Add a New CT

1. Open the **Manage CTs** panel and go to the **Add a New CT** section.
2. Enter the course, CT number, date, teacher’s name, and exam topics.
3. Click the **+ Add CT** button.
4. Finally, click **Save Changes**.

## How to Delete a CT

* Click the **Delete** button beside the CT you want to remove.
* Finally, click **Save Changes**.

## How to Restore the Default Schedule

* Click the **Restore Defaults** button.
* Then click **Save Changes**.

## Important Information

* All changes are saved in the browser’s local storage. They will remain available after refreshing if you use the same browser and website address.
* If multiple CT exams are scheduled on the same day, all of them will appear together in the Next CT countdown card.
* Opening the website by double-clicking the file uses a `file://` address, while VS Code Live Server uses a http://127.0.0.1 address. These addresses use separate browser storage. Therefore, always open the website in the same way to access your saved information.
* Changes made in your browser will not automatically appear in your friend’s browser. To show the same dates to everyone, update the default schedule and deploy or upload the website again.
* Always keep `index.html`, `style.css`, and `script.js` in the same folder.
