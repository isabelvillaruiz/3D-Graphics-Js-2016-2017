var word = "gato";
var ref = ["_","_","_","_"];
console.log(word.length);
console.log(word[1]);
console.log(ref[1]);
var fails = 0;
var hits = 0;



function comparar(){
  var letter, text;
  var found = false;
  document.getElementById("empty_letters").innerHTML = ref;
  letter = document.getElementById("letter").value;
  for (var i = 0; i < word.length; i++){
    if (word[i] == letter){
      found = true;
      if (ref[i] === "_"){
        ref[i] = letter;
        document.getElementById("empty_letters").innerHTML = ref;
      }
    }
  }
  if (found == true){
      document.getElementById("trying").innerHTML = "Acertaste";
      hits = hits +1;
      if (ref[i] == "_"){
        ref[i] = letter;
        document.getElementById("empty_letters").innerHTML = ref;
        console.log(hits);
      }
      if (hits == word.length){
        document.getElementById("win").innerHTML = "YOU WIN!!!! PLEASE REBOOT";
      }
  }else{
      document.getElementById("trying").innerHTML = "You failed";
      fails = fails +1;
      document.getElementById("myImage").src = "hangman"+fails+".png"
      if (fails == 6){
        document.getElementById("lost").innerHTML = "YOU LOST!!!! PLEASE REBOOT"
      }

  }
}
