Nelios - Technical 
Exercise 
Headless WordPress + Next.js 
MAY 2026 
Summary 
Build a small headless WordPress project connected to a Next.js frontend. The 
project must include: 
● WordPress backend 
● Custom post type for the listed items 
● Next.js frontend using the App Router (Tailwind v4 is recommended for 
styling library) 
● Filtering functionality 
● Responsive implementation 
● Docker-based setup (strongly recommended) or clear, short, cross-platform 
setup instructions 
Figma design: 
https://www.figma.com/design/mvJquXwaKbewAa1m2JFunr/Test-Page?node-id=380
1-10568&t=rYu7gqsqBZ6vAeu5-1 
Keep in mind that you can log in to Figma with a free account to inspect spacing, 
font sizes, and other element details. A mobile version of the design is also 
available in Figma and can be accessed from the sidebar. 
Requirements 
WordPress 
Create a headless WordPress setup with a custom post type, for example: “items”. The 
custom post type should contain the data needed for the frontend cards/listing and filters. 
You may use custom fields, taxonomies, or a custom plugin. 
Next.js 
Build the frontend using Next.js App Router, the frontend must: 
● Fetch data from the WordPress 
● Match the provided Figma design as closely as possible 
● Implement item filtering 
● Work well on desktop, tablet, and mobile 
● Handle empty states when no filtered results exist 
Filtering and responsive behavior are especially important. 
Setup 
Docker is strongly recommended. Ideally, the reviewer should be able to run the project 
with something like: 
Shell
docker compose up --build 
However, another setup approach is acceptable, as long as it is: 
● Cross-platform 
● Fast to set up 
● Clearly documented 
● Easy to follow 
● Not dependent on undocumented local machine configuration 
The README must include: 
● Frontend URL 
● WordPress URL 
● WordPress admin URL 
● WordPress credentials, if seeded 
● Start command 
● Stop command 
● Reset/cleanup command, if applicable 
Keep the setup instructions short and practical. 
Deliverables 
Submit a Git repository containing: 
● Source code 
● Setup instructions 
● WordPress custom post type 
● Next.js frontend 
● Filtering 
● Responsive layout 
● Short README 
Evaluation Criteria 
We will review: 
● Ease and speed of setup 
● Cross-platform compatibility 
● WordPress custom post type implementation 
● Next.js App Router usage 
● Filtering functionality 
● Responsive behavior 
● Accuracy to the Figma design 
● Code organization and readability 
Deadline 
Please send your work to dev-assessment@nelios.com until Wednesday 13/4/2026 at 23:59. Please 
do not hesitate to contact us at this email for any further questions. 
Good luck!