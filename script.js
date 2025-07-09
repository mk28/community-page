let questions = [];
let savedQuestions = [];
let leaderboard = {};
let trendingTags = ["Fundraising", "Pitch", "Networking", "SaaS"];

function postQuestion() {
  const input = document.getElementById("questionInput");
  const anon = document.getElementById("anonToggle").checked;
  const text = input.value.trim();
  if (!text) return alert("Please enter a question.");

  const user = anon ? "Anonymous" : "You";
  const newQ = {
    user,
    text,
    upvotes: 0,
    comments: [],
    id: Date.now()
  };

  questions.unshift(newQ);
  input.value = "";
  renderQuestions();
}

function renderQuestions() {
  const feed = document.getElementById("questionFeed");
  feed.innerHTML = "";

  questions.forEach((q, index) => {
    const div = document.createElement("div");
    div.className = "question";
    div.innerHTML = `
      <strong>${q.user}</strong>
      <p>${q.text}</p>
      <p class="meta">Upvotes: ${q.upvotes}</p>
      <button onclick="upvote(${index})">👍 Upvote</button>
      <button onclick="saveAnswer(${index})">🔖 Save</button>
      <button onclick="toggleCommentBox(${index})">💬 Comment</button>
      <div class="comment-section" id="comment-${index}" style="display:none;">
        <div>${q.comments.map(c => `<p>💭 ${c}</p>`).join("")}</div>
        <input type="text" placeholder="Add a comment..." onkeydown="addComment(event, ${index})" />
      </div>
    `;
    feed.appendChild(div);
  });

  updateLeaderboard();
}

function upvote(index) {
  questions[index].upvotes++;
  renderQuestions();
}

function saveAnswer(index) {
  const saved = questions[index];
  if (!savedQuestions.includes(saved)) {
    savedQuestions.push(saved);
    alert("Saved for later!");
  } else {
    alert("Already saved.");
  }
}

function toggleCommentBox(index) {
  const box = document.getElementById(`comment-${index}`);
  box.style.display = box.style.display === "none" ? "block" : "none";
}

function addComment(e, index) {
  if (e.key === "Enter") {
    const comment = e.target.value.trim();
    if (!comment) return;
    questions[index].comments.push(comment);
    e.target.value = "";
    renderQuestions();
  }
}

function postInvestorAsk() {
  const input = document.getElementById("askWallInput");
  const text = input.value.trim();
  if (!text) return alert("Enter your request.");

  const div = document.createElement("div");
  div.className = "wall-post";
  div.innerText = `🧠 ${text}`;
  document.getElementById("askWallFeed").prepend(div);
  input.value = "";
  showNotification("📢 New investor request posted!");
}

function postPitch() {
  const input = document.getElementById("pitchInput");
  const text = input.value.trim();
  if (!text) return alert("Write your pitch.");

  const li = document.createElement("li");
  li.innerHTML = `🎤 ${text}`;
  document.getElementById("pitchList").prepend(li);
  input.value = "";
  showNotification("🚀 New pitch submitted for feedback.");
}

function showNotification(text) {
  const notif = document.createElement("div");
  notif.className = "announcement";
  notif.innerText = text;
  document.querySelector("main").prepend(notif);
  setTimeout(() => notif.remove(), 4000);
}

function updateLeaderboard() {
  leaderboard["You"] = questions.reduce((acc, q) => acc + (q.user === "You" ? q.upvotes : 0), 0);
  const top = Object.entries(leaderboard)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const list = document.querySelector("#leaderboard ol");
  list.innerHTML = top.map(([user, score]) => `<li>${user} – ${score} upvotes</li>`).join("");
}

// Trending Tags
function renderTags() {
  const container = document.getElementById("tagsContainer");
  container.innerHTML = trendingTags.map(tag => `<span class="tag">#${tag}</span>`).join("");
}

function addTag() {
  const input = document.getElementById("tagInput");
  const tag = input.value.trim();
  if (!tag) return alert("Please enter a tag.");
  if (trendingTags.includes(tag)) return alert("Tag already exists.");

  trendingTags.unshift(tag);
  if (trendingTags.length > 10) trendingTags.pop();
  input.value = "";
  renderTags();
}

renderQuestions();
renderTags();
