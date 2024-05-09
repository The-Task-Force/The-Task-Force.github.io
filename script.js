// Get references to the necessary elements
const postContainer = document.querySelector('.post-container');
const blogPosts = document.querySelector('.blog-posts');

// Function to read blog posts from the blogs folder
async function readBlogPosts() {
  const blogFolder = 'blogs/';
  const blogFiles = await fetch(blogFolder + 'filelist.txt')
    .then(response => response.text())
    .then(data => data.trim().split('\n'))
    .catch(error => console.error('Error:', error));

  const allPosts = [];

  await Promise.all(
    blogFiles.map(async file => {
      const content = await fetch(blogFolder + file).then(response => response.text());
      const lines = content.split('\n');
      const isFeatured = lines[0].trim() === '#featured';
      const dateString = lines[1].trim().replace('date:', '');
      const date = new Date(dateString);
      const title = lines.find(line => line.startsWith('# ')).replace('# ', '');
      const excerpt = lines.slice(lines.findIndex(line => line.startsWith('# ')) + 1, lines.findIndex(line => line.startsWith('# ')) + 4).join('\n');

      const post = { title, excerpt, date, isFeatured, file };
      allPosts.push(post);
    })
  );

  allPosts.sort((a, b) => b.date - a.date); // Sort posts by date in descending order

  return allPosts;
}

// Function to create a post preview element
function createPostPreview(post, container) {
  const postPreview = document.createElement('div');
  postPreview.classList.add('blog-post');
  postPreview.innerHTML = `
    <h3>${post.title}</h3>
    <p class="date">${post.date.toLocaleDateString()}</p>
    <p>${post.excerpt}</p>
  `;

  // Add click event listener to navigate to the blog post page
  postPreview.addEventListener('click', () => {
    window.location.href = `post.html?file=${post.file}`;
  });

  container.appendChild(postPreview);
}

// Populate featured blog posts and blog posts
readBlogPosts()
  .then(allPosts => {
    const featuredPosts = allPosts.filter(post => post.isFeatured);
    const regularPosts = allPosts.filter(post => !post.isFeatured);

    // Populate featured blog posts
    featuredPosts.forEach(post => createPostPreview(post, postContainer));

    // Populate blog posts sorted by date
    regularPosts.forEach(post => createPostPreview(post, blogPosts));

    // Add animation to post previews
    const postPreviews = document.querySelectorAll('.blog-post');
    postPreviews.forEach((preview, index) => {
      preview.style.animationDelay = `${index * 0.1}s`;
    });
  })
  .catch(error => console.error('Error:', error));

// Function to read project details from the projects folder
async function readProjectDetails() {
  const projectFolder = 'projects/';
  const projectFiles = await fetch(projectFolder + 'filelist.txt')
    .then(response => response.text())
    .then(data => data.trim().split('\n'))
    .catch(error => console.error('Error:', error));

  const allProjects = [];

  await Promise.all(
    projectFiles.map(async file => {
      const content = await fetch(projectFolder + file).then(response => response.text());
      const lines = content.split('\n');
      const title = lines.find(line => line.startsWith('# ')).replace('# ', '');
      const description = lines.slice(lines.findIndex(line => line.startsWith('# ')) + 1, lines.length).join('\n');

      const project = { title, description, file };
      allProjects.push(project);
    })
  );

  return allProjects;
}

// Function to create a project preview element
function createProjectPreview(project, container) {
  const projectPreview = document.createElement('div');
  projectPreview.classList.add('project-preview');
  projectPreview.innerHTML = `
    <h3>${project.title}</h3>
    <p>${project.description}</p>
  `;

  // Add click event listener to navigate to the project details page
  projectPreview.addEventListener('click', () => {
    window.location.href = `project.html?file=${project.file}`;
  });

  container.appendChild(projectPreview);
}

// Populate project previews
const projectContainer = document.querySelector('.project-container');

readProjectDetails()
  .then(allProjects => {
    allProjects.forEach(project => createProjectPreview(project, projectContainer));
  })
  .catch(error => console.error('Error:', error));