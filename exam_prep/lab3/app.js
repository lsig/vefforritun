const op_arr = ["+", "-", "*"];
const gen_rand = () => {
  return Math.ceil(Math.random() * 10);
};

const gen_math_prob = () => {
  const rand_arr = [gen_rand(), gen_rand()].sort((a, b) => {
    return a - b;
  });
  const lower = rand_arr[0];
  const higher = rand_arr[1];
  const operator = op_arr[higher % 3];
  return {
    operator: operator,
    higher: higher,
    lower: lower,
    problem: `${higher} ${operator} ${lower}`,
  };
};

let m_prob = gen_math_prob();
let answer = eval(m_prob.problem);

const problem_placement = document.getElementById("taskMsg");
problem_placement.innerHTML = m_prob.problem;

const result_msg = document.getElementById("resultMsg");
const submitBtn = document.getElementsByClassName("btn-primary");

const evaluateResult = () => {
  const user_answer = document.getElementById("mathIn").value;
  submitBtn.disabled = true;

  const correct = user_answer == answer;
  result_msg.style.display = "block";
  result_msg.innerHTML = correct ? "Correct" : "Incorrect";
  result_msg.classList.remove(correct ? "alert-danger" : "alert-success");
  result_msg.classList.add(correct ? "alert-success" : "alert-danger");
  m_prob = gen_math_prob();

  setTimeout(() => {
    problem_placement.innerHTML = m_prob.problem;
    answer = eval(m_prob.problem);
    document.getElementById("mathIn").value = "";
    result_msg.style.display = "none";
    submitBtn.disabled = false;
  }, 5000);
};

const printLoop = () => {
  const user_captcha_ans = document.getElementById("mathIn").value;
  const user_num = document.getElementById("loopNumber").value;
  const higher_num = m_prob.higher;
  const lower_num = m_prob.lower;
  const num_arr = [user_captcha_ans, user_num, higher_num, lower_num];

  let loop_output = document.getElementById("loopOutput");
  loop_output.innerHTML = "";

  num_arr.forEach((num, index) => {
    setTimeout(() => {
      if (index === num_arr.length - 1) {
        loop_output.innerHTML += `${num}`;
      } else {
        loop_output.innerHTML += `${num}<br>`;
      }
    }, (index + 1) * 1000);
  });
};
