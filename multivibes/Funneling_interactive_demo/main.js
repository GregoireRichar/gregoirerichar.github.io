/**
 *
 * This Source Code is adapted from TURBOTOUCH PREDICTOR, which subject to the terms of
 * TURBOTOUCH PREDICTOR version 1.0 licence
 * available in LICENCE.txt
 *
 * Author: Grégoire Richard
 *
 */

document.addEventListener("DOMContentLoaded", function() {
   var points = [];
   var state = "UP";

   //MAtrix of triangles, and vertices
   var triangles = [];
   var circles = [];

   let intensite_1;
   let intensite_2;
   let intensite_3;

   // get canvas element and create context
   var canvas  = document.getElementById('canvas');
   var context = canvas.getContext('2d');
   var width   = window.innerWidth;
   var height  = window.innerHeight;

   // set canvas to full browser width/height
   canvas.width = width;
   canvas.height = height;

   // Creating THE cursor (which is equivalent to the virtual vibration) and intermediate vibration (for projection purpose)
   let cursor = new Circle(canvas.width / 2, canvas.height / 2, 10);
   let intermediate_vibration = new Circle(canvas.width / 2, canvas.height / 2, 10);

   //Testing initialization of circles with one triangle
   let sommet1 = new Circle(canvas.width * 15 / 30, canvas.height / 3, 30, "Vertex_1");
   let sommet2 = new Circle(canvas.width * 11 / 30, canvas.height * 2 / 3, 30, "Vertex_2");
   let sommet3 = new Circle(canvas.width * 19 / 30, canvas.height * 2 / 3, 30, "Vertex_3");
   let sommet4 = new Circle(canvas.width * 7 / 30, canvas.height / 3, 30, "Vertex_4");
   let sommet5 = new Circle(canvas.width * 23 /30, canvas.height / 3, 30, "Vertex_5");
   let sommet6 = new Circle(canvas.width * 3/ 30, canvas.height * 2 / 3, 30, "Vertex_6");
   let sommet7 = new Circle(canvas.width * 27 / 30, canvas.height * 2 / 3, 30, "Vertex_7");

   circles.push(sommet1, sommet2, sommet3, sommet4, sommet5, sommet6, sommet7);

   let triangle1 = new Cell(sommet1, sommet2, sommet3, false, "triangle_1");
   let triangle2 = new Cell(sommet1, sommet2, sommet4, false, "triangle_2");
   let triangle3 = new Cell(sommet6, sommet2, sommet4, false, "triangle_3");
   let triangle4 = new Cell(sommet7, sommet5, sommet3, false, "triangle_4");
   let triangle5 = new Cell(sommet1, sommet5, sommet3, false, "triangle_5");

   triangles.push(triangle1, triangle2, triangle3, triangle4, triangle5);

   // Set up touch events for mobile, etc
   canvas.addEventListener("touchstart", function (e) {
     //mousePos = getTouchPos(canvas, e);
     var touch = e.touches[0];
     var mouseEvent = new MouseEvent("mousedown", {
       clientX: touch.clientX,
       clientY: touch.clientY
     });
     canvas.dispatchEvent(mouseEvent);
   }, false);
   canvas.addEventListener("touchend", function (e) {
     var mouseEvent = new MouseEvent("mouseup", {});
     canvas.dispatchEvent(mouseEvent);
   }, false);
   canvas.addEventListener("touchmove", function (e) {
     var touch = e.touches[0];
     var mouseEvent = new MouseEvent("mousemove", {
       clientX: touch.clientX,
       clientY: touch.clientY
     });
     canvas.dispatchEvent(mouseEvent);
   }, false);

   // compute refresh rate
   var last_ts = new Date().getTime();

   // Get the position of a touch relative to the canvas
   function getTouchPos(canvasDom, touchEvent) {
     var rect = canvasDom.getBoundingClientRect();
     return {
       x: touchEvent.touches[0].clientX - rect.left,
       y: touchEvent.touches[0].clientY - rect.top
     };
   }

   //radio button
   var verticeChange = document.getElementById("vertex");
   verticeChange.addEventListener("click", function (e) {
      if(whichTriangle(cursor) != null){
         whichTriangle(cursor).switchVertices();
         redraw();
         console.log("changed ?");
      }

   })

   window.onresize = function(e){
      width   = window.innerWidth;
      height  = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      //circles.forEach(circle => circle.setX());
      
   };

   var instBut  = document.getElementById('instBut');
   instBut.onclick = function(e) {
      var x = document.getElementById("instructions");
      if (x.style.display === "none") {
          x.style.display = "block";
          instBut.textContent = "Hide instructions";
      } else {
          x.style.display = "none";
          instBut.textContent = "Show instructions";
      }
   }

   // register mouse event handlers
   canvas.onmousedown = function(e){
      state = "DOWN";
      points.push({x: e.offsetX, y: e.offsetY, t: e.timeStamp * 1000000000});
      cursor.setX(e.offsetX);
      cursor.setY(e.offsetY);
      if(whichTriangle() != null){
         console.log("do we get there ?");
         hovered();
      }
   };
   
   canvas.onmouseup = function(e){
      state = "UP";
      clearScreen();
      points = [];
      redraw();
   };

   canvas.onmousemove = function(e) {
      if (state == "DOWN") {
         points.push({x: e.offsetX, y: e.offsetY, t: e.timeStamp * 1000000000});
         var t1 = new Date().getTime();
         var t2 = new Date().getTime();
         predictionTime = t2 - t1;
         cursor.setX(e.offsetX);
         cursor.setY(e.offsetY);
         if(whichTriangle() != null){
            whichTriangle().setState(true);
            hovered();
         }
         redraw();
      }
   };

   function drawTriangle(triangle){
      context.beginPath();
      context.lineWidth="1";
      context.strokeStyle="black";
      context.fillStyle = "gray";

      context.moveTo(triangle.getSommets()[0].getX(), triangle.getSommets()[0].getY());
      context.lineTo(triangle.getSommets()[1].getX(), triangle.getSommets()[1].getY());

      context.moveTo(triangle.getSommets()[1].getX(), triangle.getSommets()[1].getY());
      context.lineTo(triangle.getSommets()[2].getX(), triangle.getSommets()[2].getY());

      context.moveTo(triangle.getSommets()[2].getX(), triangle.getSommets()[2].getY());
      context.lineTo(triangle.getSommets()[0].getX(), triangle.getSommets()[0].getY());

      context.stroke();
      triangle.getSommets().forEach(circle => {
         context.beginPath();   
         context.fillStyle = "gray";
         context.arc(circle.getX(), circle.getY(), circle.getR(), 0, 2 * Math.PI, false);
         context.lineWidth = 3;
         context.stroke();
         context.fill();
         context.font = "12px Georgia";      
         context.fillStyle = "black";
         txt = circle.getName();
         context.fillText(txt, circle.getX()- 80, circle.getY() - 20);
         });
      
      
   }

   function equationDroite(A, B){
      let a = (A.getY() - B.getY()) / (A.getX() - B.getX());
      let b = A.getY() - a * A.getX();

      return [a,b];
   }

   function intersection2Droites(a1, b1, a2, b2){
      let abcisse = (b2 - b1) / (a1 - a2);
      let ordonne = a2 * abcisse + b2;

      return [abcisse, ordonne];
   }

   function ratio(depart, arrivee, entre){
      return (Math.sqrt(((depart.getX() - entre.getX()) * (depart.getX() - entre.getX()) + (depart.getY() - entre.getY()) * (depart.getY() - entre.getY())) / ((depart.getX() - arrivee.getX()) * (depart.getX() - arrivee.getX()) + (depart.getY() - arrivee.getY()) * (depart.getY() - arrivee.getY()))));
   }

   function vibrateTriangle(triangle){
      let som1 = triangle.getSommets()[0];
      let som2 = triangle.getSommets()[1];
      let som3 = triangle.getSommets()[2];

      a1 = equationDroite(som1, cursor)[0];
      b1 = equationDroite(som1, cursor)[1];
      a2 = equationDroite(som2, som3)[0];
      b2 = equationDroite(som2, som3)[1];

      intermediate_vibration.setX(intersection2Droites(a1, b1, a2, b2)[0]);
      intermediate_vibration.setY(intersection2Droites(a1, b1, a2, b2)[1]);

      drawInter(triangle);

      let alpha = ratio(som1, intermediate_vibration, cursor);
      let beta = ratio(som2, som3, intermediate_vibration);

      intensite_1 = (Math.sqrt(1 - alpha) * 100).toFixed(1);
      intensite_2 = (Math.sqrt(alpha * (1 - beta)) * 100).toFixed(1);
      intensite_3 = (Math.sqrt(alpha * beta) * 100).toFixed(1);

      //console.log("alpha : " + alpha + "; beta : " + beta);
   }


   function colorTriangle(triangle){
      context.beginPath();
      context.lineWidth="2";
      context.strokeStyle="red";

      const gradient = context.createLinearGradient(20, 0, 220, 0);
      // Add three color stops
      gradient.addColorStop(0, "white");
      gradient.addColorStop(1, "green");
      context.fillStyle = gradient;

      context.moveTo(triangle.getSommets()[0].getX(), triangle.getSommets()[0].getY());
      context.lineTo(triangle.getSommets()[1].getX(), triangle.getSommets()[1].getY());

      context.moveTo(triangle.getSommets()[1].getX(), triangle.getSommets()[1].getY());
      context.lineTo(triangle.getSommets()[2].getX(), triangle.getSommets()[2].getY());

      context.moveTo(triangle.getSommets()[2].getX(), triangle.getSommets()[2].getY());
      context.lineTo(triangle.getSommets()[0].getX(), triangle.getSommets()[0].getY());

      context.stroke();
      triangle.getSommets().forEach(circle => {
         context.beginPath();
         context.arc(circle.getX(), circle.getY(), circle.getR(), 0, 2 * Math.PI, false);
         context.lineWidth = 3;
         context.stroke();
         context.fill();
         });
      
   }

   function drawCursor(){
      context.strokeStyle="black";
      context.fillStyle = "purple";
      context.beginPath();
      context.arc(cursor.getX(), cursor.getY(), cursor.getR(), 0, 2 * Math.PI, false);
      context.lineWidth = 3;
      context.stroke();
      context.fill();
   }

   function drawInter(triangle){
      context.strokeStyle="black";
      context.fillStyle = "blue";
      context.beginPath();
      context.arc(intermediate_vibration.getX(), intermediate_vibration.getY(), intermediate_vibration.getR(), 0, 2 * Math.PI, false);
      context.lineWidth = 3;
      context.moveTo(triangle.getSommets()[0].getX(), triangle.getSommets()[0].getY());
      context.lineTo(intermediate_vibration.getX(), intermediate_vibration.getY());

      context.stroke();
      context.fill();
   }

   function whichTriangle() {
      let inThere;
      triangles.forEach(triangle => {if(triangle.containPoint(cursor.getX(),cursor.getY())){
         inThere = triangle;
      }});
      return inThere;
   }

   function hovered(){
      triangles.forEach(triangle => triangle.setState(false));
      if(whichTriangle() != null){
         whichTriangle().setState(true);
      }
   }


   function amplitudeTexte(triangle){
      var txt_1 = "Actuator " + triangle.getSommets()[0].getName() + " intensity : " + intensite_1;
      var txt_2 = "Actuator " + triangle.getSommets()[1].getName() + " intensity : " + intensite_2;
      var txt_3 = "Actuator " + triangle.getSommets()[2].getName() + " intensity : " + intensite_3;
      context.font = "20px Georgia";      
      context.fillStyle = "black"; 
      context.fillText(txt_1, 15, 15);
      context.fillText(txt_2, 15, 40);
      context.fillText(txt_3, 15, 65);
   }

   function redraw () {
      var ts = new Date().getTime();
      last_ts = ts;

      clearScreen();

      let currTriangle = whichTriangle();
      
      triangles.forEach(triangle => drawTriangle(triangle));
      if(currTriangle !=null){
         colorTriangle(currTriangle);
         vibrateTriangle(currTriangle);
         /*
         if(state!= "UP"){
            amplitudeTexte(currTriangle);
         }*/
         amplitudeTexte(currTriangle);
      }
      
      if (state == "UP") {
        var txt = "Touch the screen or click and drag to interact";
        context.font = "30px Georgia";      
        context.fillStyle = "black"; 
        context.fillText(txt,width/2-context.measureText(txt).width/2,height/5);
      }

      drawCursor();
      
      
   }

   function clearScreen() {
      context.clearRect(0, 0, canvas.width, canvas.height);
   }
   
   redraw();

});

