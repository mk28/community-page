let questions = [];
let savedQuestions = [];
let leaderboard = {};

// ========== Post a Question ==========
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

// ========== Render Questions ==========
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
      <button class="upvote-btn" onclick="upvote(${index})">👍 Upvote</button>
      <button class="save-btn" onclick="saveAnswer(${index})">🔖 Save</button>
      <button class="reply-btn" onclick="toggleCommentBox(${index})">💬 Comment</button>
      <div class="comment-section" id="comment-${index}" style="display:none;">
        <div>${q.comments.map(c => `<p>💭 ${c}</p>`).join("")}</div>
        <input type="text" placeholder="Add a comment..." onkeydown="addComment(event, ${index})" />
      </div>
    `;

    feed.appendChild(div);
  });

  updateLeaderboard();
}

// ========== Upvote ==========
function upvote(index) {
  questions[index].upvotes++;
  renderQuestions();
}

// ========== Save Answer ==========
function saveAnswer(index) {
  const saved = questions[index];
  if (!savedQuestions.includes(saved)) {
    savedQuestions.push(saved);
    alert("Saved for later!");
  } else {
    alert("Already saved.");
  }
}

// ========== Commenting System ==========
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

// ========== Investor Ask Wall ==========
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

// ========== Pitch Practice ==========
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

// ========== Notification ==========
function showNotification(text) {
  const notif = document.createElement("div");
  notif.className = "announcement";
  notif.innerText = text;
  document.querySelector("main").prepend(notif);

  setTimeout(() => notif.remove(), 4000);
}

// ========== Leaderboard (Mocked) ==========
function updateLeaderboard() {
  leaderboard["You"] = questions.reduce((acc, q) => acc + (q.user === "You" ? q.upvotes : 0), 0);
  const top = Object.entries(leaderboard)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const list = document.querySelector("#leaderboard ol");
  list.innerHTML = top.map(([user, score]) => `<li>${user} – ${score} upvotes</li>`).join("");
}

// Initialize
renderQuestions();
