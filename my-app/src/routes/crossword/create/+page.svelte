<link rel="stylesheet" href="/shared.css" />

<script>
    import { onMount } from "svelte";

    var cols = 0;
    var rows = 0;
    let vertical = false;
    let lastVert = 0;
    let lastHoriz = 0;

    let a = [];
    let d = [];
    


    onMount(() => {
        setUp();
    });

    function setUp() {
        var fullContainer = document.createElement('div');
        fullContainer.setAttribute("class", "full-container");
        var iDiv = document.createElement('div');
        iDiv.setAttribute("class", "grid-container");
        document.getElementsByTagName('body')[0].appendChild(fullContainer);
        let downList = document.createElement('div');
        let acrossList = document.createElement('div');
        downList.className = "clue-list-across";
        acrossList.className = "clue-list-down";

        cols = parseInt(window.getComputedStyle(document.body).getPropertyValue('--cols'));
        rows = parseInt(window.getComputedStyle(document.body).getPropertyValue('--rows'));
        
        let number = 1;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                var container = document.createElement('span');
                var s = document.createElement('span');
                container.className = "square-container";


                var innerDiv = document.createElement('input');
                innerDiv.type = "text";
                innerDiv.className = 'square';
                innerDiv.id = (i * cols + j).toString();
                innerDiv.maxLength = 1;
                innerDiv.style.padding = "0";
                innerDiv.style.border = "none";
                innerDiv.style.textTransform = "uppercase";
                innerDiv.style.caretColor = "transparent";

                if (innerDiv.className !== 'blocked') {
                    let prevAcross = i * cols + j - 1;
                    let across = false;
                    if (document.getElementById(prevAcross.toString())?.className === 'blocked' || j === 0) {
                        innerDiv.classList.add(number.toString() + "across");
                        s.innerHTML = number.toString();
                        lastHoriz = i * cols + j;
                        number++;
                        across = true;
                        a[i * cols + j] = 0;
                        let clue = document.createElement('textarea');
                        clue.className = 'clue';
                        clue.id = (i * cols + j).toString() + 'ac';
                        acrossList.appendChild(clue);
                    }

                    let prevDown = (i - 1) * cols + j;                    
                    if (document.getElementById(prevDown.toString())?.className === 'blocked' || i === 0) {
                        if (across)
                            number--;
                        innerDiv.classList.add(number.toString() + "down");
                        s.innerHTML = number.toString();
                        lastVert = i * cols + j;
                        number++;
                        d[i * cols + j] = 0;
                        let clue = document.createElement('textarea');
                        clue.className = 'clue';
                        clue.id = (i * cols + j).toString() + 'dc';
                        downList.appendChild(clue);
                    }
                }

                innerDiv.addEventListener('focus', function(e) {
                    if (document.getElementById((i * cols + j).toString())?.className !== 'blocked') {
                        highlightWord(i * cols + j);
                    }
                    else {
                        document.activeElement.style.backgroundColor = "dimgray";
                    }
                });

                innerDiv.addEventListener('blur', function(e) {
                    unHighlightWord();
                });

                innerDiv.addEventListener('keyup', function(e) {
                    var offset = 0;
                    let curID = (i * cols + j).toString();
                    var curInput = document.getElementById(curID);
                    if(e.code >= "KeyA" && e.code <= "KeyZ" && curInput?.className !== 'blocked') {
                        curInput.value = e.key.toUpperCase();
                        offset = 1;
                    } 
                    else if (e.key === "Backspace") {
                        curInput.value = "";
                        offset = -1;
                    }
                    else if (e.code === "Space") {
                        swapDirection(i * cols + j);
                        return;
                    }
                    else if (e.key === "Enter") {
                        swap();
                        return;
                    }

                    if (vertical) {
                        offset = offset * cols;
                    }

                    let nextID = (i * cols + j + offset).toString();
                    var nextInput = document.getElementById(nextID);
                    if ((nextInput?.className === 'blocked' || nextInput == null) && e.code >= "KeyA" && e.code <= "KeyZ") {
                        nextWord(i * cols + j, 0);
                    }
                    else if (nextInput) {
                        nextInput.focus();
                    }
                });

                innerDiv.ondblclick = function(e) {
                    swapDirection(i * cols + j);
                }

                innerDiv.onkeydown = function(e) {
                    if (e.key === "ArrowRight") {
                        vertical = false;
                        let nextID = (i * cols + j + 1).toString();
                        var nextInput = document.getElementById(nextID);
                        if (nextInput) {
                            nextInput.focus();
                        }
                    } 
                    else if (e.key === "ArrowLeft") {
                        vertical = false;
                        let nextIDBack = (i * cols + j - 1).toString();
                        var nextInputBack = document.getElementById(nextIDBack);
                        if (nextInputBack) {
                            nextInputBack.focus();
                        }
                    }
                    else if (e.key === "ArrowDown") {
                        vertical = true;
                        let nextIDDown = ((i + 1) * cols + j).toString();
                        var nextInputDown = document.getElementById(nextIDDown);
                        if (nextInputDown) {
                            nextInputDown.focus();
                        }
                    }
                    else if (e.key === "ArrowUp") {
                        vertical = true;
                        let nextIDUp = ((i - 1) * cols + j).toString();
                        var nextInputUp = document.getElementById(nextIDUp);
                        if (nextInputUp) {
                            nextInputUp.focus();
                        }
                    }
                    else if (e.key === "Tab") {
                        nextWord(i * cols + j, 1);
                    }
                }
                
                container.appendChild(s);
                container.appendChild(innerDiv);
                iDiv.appendChild(container);
                fullContainer.appendChild(iDiv);
            }
        }

        let inputContainer = document.createElement('form');
        let rowInput = document.createElement('input');
        let colInput = document.createElement('input');
        rowInput.id = "rowInput";
        colInput.id = "colInput";
        rowInput.type = "number";
        colInput.type = "number";
        rowInput.placeholder = "rows";
        colInput.placeholder = "columns";
        let submitDims = document.createElement('input');
        submitDims.type = "submit";
        submitDims.value = "resize";
        submitDims.addEventListener("click", (e) => {
            e.preventDefault();

            let newRows = document.getElementById("rowInput");
            let newCols = document.getElementById("colInput")

            if (newCols.value === "" || newRows.value === "") {
                console.log("bad");
            }
            else {
                let r = document.querySelector(':root');
                r.style.setProperty('--cols', newCols.value);
                r.style.setProperty('--rows', newRows.value);
                document.querySelectorAll('div').forEach(div => div.remove());
                setUp();
            }
        });
        inputContainer.appendChild(rowInput);
        inputContainer.appendChild(colInput);
        inputContainer.appendChild(submitDims);

        fullContainer.appendChild(downList);
        fullContainer.appendChild(acrossList);
        fullContainer.appendChild(inputContainer);
    }

    function highlightWord(ID) {
        let clueHighlight = 0;
        if (!ID.toString().includes('c'))
            document.getElementById(ID.toString()).style.backgroundColor = "rgba(0, 0, 255, 0.65)";
        else
            clueHighlight = 1;

        let offset = vertical ? cols : 1;
        let prev = ID - offset;
        let next = ID + offset - clueHighlight;
        while (document.getElementById(prev.toString())?.className !== 'blocked' && (vertical ? 1 : prev % cols !== cols - 1) && prev >= 0) {
            document.getElementById(prev.toString()).style.backgroundColor = "rgba(173, 216, 230, 0.5)";
            prev -= offset;
        }
        while (document.getElementById(next.toString())?.className !== 'blocked' && (vertical ? 1 : next % cols !== 0) && next < rows * cols) {
            document.getElementById(next.toString()).style.backgroundColor = "rgba(173, 216, 230, 0.5)";
            next += offset;
        }
    }

    function unHighlightWord() {
        for (let i = 0; i < rows * cols; i++) {
            if (document.getElementById(i.toString())?.className !== 'blocked') {
                document.getElementById(i.toString()).style.backgroundColor = "transparent";
            }
            else {
                document.getElementById(i.toString()).style.backgroundColor = "black";
            }
        }
    }
    
    function swapDirection(ID) {
        if (document.getElementById(ID.toString())?.className === 'blocked') {
            return;
        }
        vertical = !vertical;
        unHighlightWord();
        highlightWord(ID);
    }

    function nextWord(ID, extra) {
        if (document.getElementById(ID.toString())?.className === 'blocked') {
            return;
        }
        
        let lastValid = ID;
        let count = 1;
        if (!vertical) {
            lastValid++;
            while (a[lastValid] === undefined || completed(lastValid)) {
                lastValid++;
                if (lastValid >= rows * cols) {
                    startAtBeginning();
                    return;
                }
            }
            document.getElementById((lastValid).toString())?.focus();
        }
        else {
            while (document.getElementById(lastValid.toString())?.className !== 'blocked' && lastValid >= cols) {
                lastValid -= cols;
                if (lastValid < cols && document.getElementById(lastValid.toString())?.className !== 'blocked')  {
                    lastValid -= cols
                    break;
                }
            }
            lastValid += cols;
            lastValid++;
            while (d[lastValid] === undefined || completed(lastValid)) {
                lastValid++;
                if (lastValid >= rows * cols) {
                    startAtBeginning();
                    return;
                }
            }
            document.getElementById((lastValid).toString())?.focus();
        }
    }

    function swap() {
        if (document.activeElement?.classList.value.includes("blocked")) {
            document.activeElement.className = "square";
        }
        else if (document.activeElement?.classList.value.includes("square")) {
            unHighlightWord();
            document.activeElement.className = "blocked";
            if (document.activeElement instanceof HTMLInputElement) {
                document.activeElement.value = "";
                document.activeElement.maxLength = 0;
            }
        }
        let id = (Number(document.activeElement?.getAttribute("id")) + 1) % (rows * cols);
        document.getElementById(id.toString())?.focus();
        renumber();
    }

    function renumber() {
        a = [];
        d = [];
        let number = 1;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let innerDiv = document.getElementById((i * cols + j).toString());
                let parent = innerDiv?.parentElement;
                parent.children[0].innerHTML = "";
                if (innerDiv.className !== 'blocked') {
                    innerDiv.className = "";
                    innerDiv?.classList.add('square');
                    let prevAcross = i * cols + j - 1;
                    let across = false;
                    if (document.getElementById(prevAcross.toString())?.className === 'blocked' || j === 0) {
                        innerDiv.classList.add(number.toString() + "across");
                        parent.children[0].innerHTML = number.toString();
                        number++;
                        across = true;
                        a[i * cols + j] = 0;
                    }

                    let prevDown = (i - 1) * cols + j;                    
                    if (document.getElementById(prevDown.toString())?.className === 'blocked' || i === 0) {
                        if (across)
                            number--;
                        innerDiv.classList.add(number.toString() + "down");
                        parent.children[0].innerHTML = number.toString();
                        lastVert = i * cols + j;
                        number++;
                        d[i * cols + j] = 0;
                    }
                }
            }
        }
    }

    function completed(ID) {
        let temp = ID;
        if (vertical) {
            while ((document.getElementById(temp.toString())?.className !== 'blocked' || temp < cols) && temp >= 0) {
                let cur = document.getElementById(temp.toString());
                if (cur.value === "") {
                    return false;
                }
                temp -= cols;
            }
            while (document.getElementById(ID.toString())?.className !== 'blocked' && (ID < rows * cols)) {
                let cur = document.getElementById(ID.toString());
                if (cur.value === "") {
                    return false;
                }
                ID += cols;
            }
            return true;
        }
        else {
            while (document.getElementById(temp.toString())?.className !== 'blocked' && (temp % cols !== cols - 1) && temp >= 0) {
                let cur = document.getElementById(temp.toString());
                if (cur.value === "") {
                    return false;
                }
                temp--;
            }
            while (document.getElementById(ID.toString())?.className !== 'blocked' && ((ID % cols !== 0) || ID === 0) && ID < rows * cols) {
                let cur = document.getElementById(ID.toString());
                if (cur.value === "") {
                    return false;
                }
                ID++;
            }
        }
        return true;
    }

    function startAtBeginning() {
        let lastValid = 0;
        vertical = !vertical;
        if (!vertical) {
            while (a[lastValid] === undefined || completed(lastValid)) {
                lastValid++;
            }
        }
        else {
            while (d[lastValid] === undefined || completed(lastValid)) {
                lastValid++;
            }
        }
        document.getElementById((lastValid).toString())?.focus();
    }

</script>
