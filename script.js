const resources = {
  interpretacao: {
    subject: "PORTUGUÊS • LEITURA",
    title: "Interpretação de texto",
    body: `<p>Interpretar um texto é compreender a mensagem que ele transmite, identificando informações importantes e percebendo o que o autor deseja comunicar.</p><h3>Como interpretar melhor?</h3><ul><li>Leia o texto com atenção, sem pressa.</li><li>Identifique o assunto principal.</li><li>Observe palavras e expressões que ajudam a entender o contexto.</li><li>Separe informações que estão escritas diretamente das conclusões que você tira.</li></ul><h3>Dica de estudo</h3><p>Depois de ler um texto, tente explicar com suas próprias palavras qual é a ideia principal. Isso ajuda a verificar se você realmente compreendeu o conteúdo.</p>`
  },
  operacoes: {
    subject: "MATEMÁTICA • FUNDAMENTOS",
    title: "Operações básicas",
    body: `<p>As quatro operações básicas são usadas em muitas situações do dia a dia.</p><h3>Adição (+)</h3><p>Juntar quantidades. Exemplo: 8 + 5 = 13.</p><h3>Subtração (−)</h3><p>Retirar ou comparar quantidades. Exemplo: 12 − 4 = 8.</p><h3>Multiplicação (×)</h3><p>Somar uma mesma quantidade várias vezes. Exemplo: 3 × 4 = 12.</p><h3>Divisão (÷)</h3><p>Repartir em partes iguais. Exemplo: 20 ÷ 5 = 4.</p><p><strong>Dica:</strong> pratique com situações reais, como dividir objetos ou calcular preços.</p>`
  },
  agua: {
    subject: "CIÊNCIAS • NATUREZA",
    title: "Ciclo da água",
    body: `<p>O ciclo da água é o movimento contínuo da água na natureza. Ela muda de estado físico e circula entre a superfície terrestre e a atmosfera.</p><h3>Etapas principais</h3><ul><li><strong>Evaporação:</strong> o calor do Sol transforma parte da água líquida em vapor.</li><li><strong>Condensação:</strong> o vapor esfria e forma pequenas gotículas, que dão origem às nuvens.</li><li><strong>Precipitação:</strong> a água retorna à superfície em forma de chuva, granizo ou neve.</li><li><strong>Infiltração e escoamento:</strong> parte da água penetra no solo e parte segue para rios, lagos e oceanos.</li></ul><p>Esse processo é essencial para a manutenção da vida e para a distribuição da água no planeta.</p>`
  },
  tempo: {
    subject: "HISTÓRIA • ORGANIZAÇÃO",
    title: "Linha do tempo",
    body: `<p>Uma linha do tempo é uma representação visual que organiza acontecimentos em ordem cronológica, ou seja, do mais antigo para o mais recente.</p><h3>Como montar?</h3><ul><li>Escolha o tema ou período que deseja apresentar.</li><li>Pesquise as datas dos acontecimentos.</li><li>Organize os fatos em ordem cronológica.</li><li>Escreva uma frase curta para explicar cada acontecimento.</li></ul><p>Linhas do tempo ajudam a perceber a sequência dos fatos e a relação entre diferentes acontecimentos históricos.</p>`
  }
};

const quizQuestions = [
  {q:"Qual é o principal objetivo da interpretação de texto?",a:["Decorar todas as palavras","Compreender a mensagem do texto","Ler o mais rápido possível"],correct:1,explain:"Isso mesmo! Interpretar é compreender a mensagem e as informações de um texto."},
  {q:"Quanto é 7 × 3?",a:["10","18","21"],correct:2,explain:"Correto! 7 multiplicado por 3 é igual a 21."},
  {q:"Qual etapa do ciclo da água forma as nuvens?",a:["Condensação","Precipitação","Infiltração"],correct:0,explain:"Muito bem! Na condensação, o vapor esfria e forma gotículas que compõem as nuvens."}
];

const defaultProgress = {completed:[], viewed:[], correct:0};
let progress = loadProgress();
function loadProgress(){try{return {...defaultProgress,...JSON.parse(localStorage.getItem("educaMaisProgress")||"{}")}}catch{return {...defaultProgress}}}
function saveProgress(){localStorage.setItem("educaMaisProgress",JSON.stringify(progress));renderProgress()}
function renderProgress(){
  const completed=progress.completed.length;
  const viewed=progress.viewed.length;
  const percent=Math.min(100,Math.round(completed/4*100));
  document.getElementById("completedCount").textContent=completed;
  document.getElementById("materialsViewed").textContent=viewed;
  document.getElementById("quizScore").textContent=progress.correct;
  document.getElementById("bigProgress").style.width=percent+"%";
  document.getElementById("progressPercent").textContent=percent+"%";
  document.getElementById("progressMessage").textContent=completed===0?"Seu caminho começa agora!":completed===4?"Parabéns! Você concluiu todos os materiais.":"Continue assim! Cada atividade conta.";
}
renderProgress();

// Menu responsivo
const menuToggle=document.getElementById("menuToggle");
const mainNav=document.getElementById("mainNav");
menuToggle.addEventListener("click",()=>{const open=mainNav.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(open));});
mainNav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{mainNav.classList.remove("open");menuToggle.setAttribute("aria-expanded","false");}));

// Navegação ativa conforme a seção
const navLinks=[...document.querySelectorAll(".nav-link")];
const sections=[...document.querySelectorAll("main section[id]")];
window.addEventListener("scroll",()=>{
  let current="inicio";
  sections.forEach(section=>{if(window.scrollY>=section.offsetTop-150)current=section.id});
  navLinks.forEach(link=>link.classList.toggle("active",link.getAttribute("href")==="#"+current));
});

// Busca e filtros da biblioteca
let activeFilter="Todas";
const searchInput=document.getElementById("searchInput");
function filterResources(){
  const term=searchInput.value.toLowerCase().trim();let visible=0;
  document.querySelectorAll(".resource-card").forEach(card=>{
    const matchesFilter=activeFilter==="Todas"||card.dataset.subject===activeFilter;
    const matchesText=(card.dataset.title+" "+card.dataset.subject).toLowerCase().includes(term);
    const show=matchesFilter&&matchesText;card.hidden=!show;if(show)visible++;
  });
  document.getElementById("emptyState").hidden=visible!==0;
}
searchInput.addEventListener("input",filterResources);
document.querySelectorAll(".filter-btn").forEach(btn=>btn.addEventListener("click",()=>{
  activeFilter=btn.dataset.filter;
  document.querySelectorAll(".filter-btn").forEach(b=>b.classList.toggle("selected",b===btn));
  filterResources();
}));

// Modal dos materiais
const modal=document.getElementById("materialModal");
let currentMaterial=null;
function openMaterial(key){
  currentMaterial=key;const item=resources[key];
  document.getElementById("modalSubject").textContent=item.subject;
  document.getElementById("modalTitle").textContent=item.title;
  document.getElementById("modalBody").innerHTML=item.body;
  const completed=progress.completed.includes(key);
  document.getElementById("markComplete").textContent=completed?"Material concluído ✓":"Marcar como estudado ✓";
  document.getElementById("markComplete").disabled=completed;
  modal.hidden=false;document.body.style.overflow="hidden";
  if(!progress.viewed.includes(key)){progress.viewed.push(key);saveProgress()}
}
document.querySelectorAll("[data-open]").forEach(btn=>btn.addEventListener("click",()=>openMaterial(btn.dataset.open)));
function closeModal(){modal.hidden=true;document.body.style.overflow=""}
document.getElementById("modalClose").addEventListener("click",closeModal);
modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!modal.hidden)closeModal()});
document.getElementById("markComplete").addEventListener("click",()=>{
  if(currentMaterial&&!progress.completed.includes(currentMaterial)){progress.completed.push(currentMaterial);saveProgress()}
  document.getElementById("markComplete").textContent="Material concluído ✓";
  document.getElementById("markComplete").disabled=true;
  const body=document.getElementById("modalBody");
  if(!body.querySelector(".modal-complete"))body.insertAdjacentHTML("beforeend",'<div class="modal-complete">Muito bem! Este material foi marcado como estudado.</div>');
});

// Quiz interativo
let questionIndex=0,selectedAnswer=null,answered=false;
const quizContent=document.getElementById("quizContent");
const quizAction=document.getElementById("quizAction");
function renderQuestion(){
  const q=quizQuestions[questionIndex];selectedAnswer=null;answered=false;
  document.getElementById("questionCount").textContent=`PERGUNTA ${questionIndex+1} DE ${quizQuestions.length}`;
  document.getElementById("quizProgress").style.width=((questionIndex+1)/quizQuestions.length*100)+"%";
  quizContent.innerHTML=`<h3 class="question">${q.q}</h3><div class="answers">${q.a.map((answer,i)=>`<button class="answer-option" data-answer="${i}">${String.fromCharCode(65+i)}. ${answer}</button>`).join("")}</div>`;
  quizContent.querySelectorAll(".answer-option").forEach(btn=>btn.addEventListener("click",()=>{
    if(answered)return;selectedAnswer=Number(btn.dataset.answer);
    quizContent.querySelectorAll(".answer-option").forEach(b=>b.classList.toggle("selected",b===btn));
    quizAction.disabled=false;
  }));
  document.getElementById("quizFeedback").textContent="";
  quizAction.textContent="Confirmar resposta";quizAction.disabled=true;
}
quizAction.addEventListener("click",()=>{
  if(!answered){
    if(selectedAnswer===null)return;answered=true;
    const q=quizQuestions[questionIndex];
    const options=[...quizContent.querySelectorAll(".answer-option")];
    options.forEach((btn,i)=>{btn.disabled=true;if(i===q.correct)btn.classList.add("correct");else if(i===selectedAnswer)btn.classList.add("wrong")});
    const right=selectedAnswer===q.correct;
    if(right){progress.correct++;saveProgress()}
    document.getElementById("quizFeedback").textContent=right?"✓ "+q.explain:"Não foi dessa vez. "+q.explain;
    document.getElementById("quizFeedback").style.color=right?"#168455":"#bd6a35";
    quizAction.textContent=questionIndex===quizQuestions.length-1?"Ver resultado":"Próxima pergunta";
    return;
  }
  if(questionIndex<quizQuestions.length-1){questionIndex++;renderQuestion()}
  else{
    quizContent.innerHTML=`<div class="quiz-result"><div style="font-size:42px">🎉</div><h3 class="question">Você chegou ao final!</h3><p style="color:#718097;font-size:13px">Você respondeu às três perguntas. Continue praticando para aprender cada vez mais.</p></div>`;
    document.getElementById("quizFeedback").textContent="Seu resultado foi registrado no painel Meu progresso.";
    quizAction.textContent="Jogar novamente";quizAction.disabled=false;answered="finished";
  }
});
document.getElementById("resetQuiz").addEventListener("click",()=>{questionIndex=0;renderQuestion()});
quizAction.addEventListener("click",()=>{if(answered==="finished"){questionIndex=0;renderQuestion()}});
renderQuestion();

// Limpar progresso
document.getElementById("clearProgress").addEventListener("click",()=>{
  if(confirm("Tem certeza de que deseja apagar seu progresso salvo neste navegador?")){
    progress={...defaultProgress};saveProgress();questionIndex=0;renderQuestion();
  }
});
