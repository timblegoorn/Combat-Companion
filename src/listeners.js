/**
 * Handles known event listeners.
 *
 * @author Andrew Jacobsson.
 * @since  v0.3
 */


/**
 * "Pops Out" the current statblock as a draggable, unique window
 */
function PopoutSB(e) {
    var id = DisplayDraggableStatBlock(currentStatBlock);
    document.getElementById(id).style.left = e.clientX + "px";
    document.getElementById(id).style.top = e.clientY + "px";
  }

  var mousecoords;
  var lastDifference = {x: 0, y: 0}
  var dragStart = {x:0,y:0};
  var dragging = false;
  var draggableID = 0;
  function DisplayDraggableStatBlock(sb) {
    const draggableWindow = document.createElement('div');
    draggableWindow.id = `draggable-${draggableID}`;
    draggableWindow.className = `draggable`
    draggableID++;
    var str = RenderStatBlock(sb, {draggable: true});
    draggableWindow.innerHTML = str;
    document.getElementById("contentContainer").append(draggableWindow);
    draggableWindow.innerHTML += `<i class="fa-solid fa-x icon rightCorner dragCorner" onclick="this.parentNode.remove()"></i>`;
    draggableWindow.innerHTML += `<i class="fa-solid fa-grip leftCorner dragCorner"></i>`;
    
    const collection = draggableWindow.getElementsByClassName("orange-border");
    collection[0].className = "orange-border draggable"


    document.getElementById(draggableWindow.id).addEventListener("mousedown", startDrag);
    return draggableWindow.id;
  }

  
  /**
   * triggered on mousedown on a draggable window
   * 
   * @param {*} e event
   * @returns 
   */
  function startDrag(e) {
    var el = e.target;
    if (el.className != "orange-border draggable") return;
    e = e || window.event;
    e.preventDefault();
    dragging = true;

    if (el.id.includes("draggable")) {
      draggingID = el.id;
    } else {
      while (el && el.parentNode) {
        el = el.parentNode;
        if (el.id.includes("draggable")) {
          draggingID = el.id;
          break;
        }
      }
    }

    dragStart.x = e.clientX;
    dragStart.y = e.clientY;
    document.onmouseup = stopDrag;
    // call a function whenever the cursor moves:
    document.onmousemove = handleDrag;
  }


  /**
   * Triggered on mouse up on draggable window
   * 
   * @param {*} e event
   */
  function stopDrag(e) {
    dragging = false;
    draggingID = undefined;
    document.onmouseup = null;
    document.onmousemove = null;
  }


  /**
   * Handles mouse dragging on mouse move on draggable window
   * 
   * @param {*} e event
   */
  function handleDrag(e) {
    e = e || window.event;
    e.preventDefault();
    lastDifference.x = dragStart.x - e.clientX;
    lastDifference.y = dragStart.y - e.clientY;
    dragStart.x = e.clientX;
    dragStart.y = e.clientY;
    if (dragging) {
      if (draggingID != undefined) {
        var newLeft = (document.getElementById(draggingID).offsetLeft - lastDifference.x);
        var newTop = (document.getElementById(draggingID).offsetTop - lastDifference.y);
        if (newLeft < 0) newLeft = 0;
        if (newTop < 0) newTop = 0;
        if (newLeft + document.getElementById(draggingID).offsetWidth > window.innerWidth) newLeft = window.innerWidth - document.getElementById(draggingID).offsetWidth;
        //if (newTop + document.getElementById(draggingID).offsetHeight > window.innerHeight) newTop = window.innerHeight - document.getElementById(draggingID).offsetHeight;
        document.getElementById(draggingID).style.top = newTop + "px";
        document.getElementById(draggingID).style.left = newLeft + "px";
      }
    };
  }