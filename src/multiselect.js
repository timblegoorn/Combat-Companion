var select = document.querySelector('select[multiple]');
var selectOptions = select.querySelectorAll('option');

var newSelect = document.createElement('div');
newSelect.classList.add('selectMultiple');
var active = document.createElement('div');
active.classList.add('active');
var optionList = document.createElement('ul');
var placeholder = select.dataset.placeholder;

var span = document.createElement('span');
span.innerText = placeholder;
active.appendChild(span);

selectOptions.forEach((option) => {
	let text = option.innerText;
	if(option.selected){
		let tag = document.createElement('a');
        tag.dataset.value = option.value;
		tag.innerHTML = "<em>"+text+"</em><i></i>";
		active.appendChild(tag);
		span.classList.add('hide');
	}else{
		let item = document.createElement('li');
        item.dataset.value = option.value;
		item.innerHTML = text;
		optionList.appendChild(item);
	}
});
var arrow = document.createElement('div');
arrow.classList.add('arrow');
active.appendChild(arrow);

newSelect.appendChild(active);
newSelect.appendChild(optionList);

select.parentElement.append(newSelect);
span.appendChild(select);

// newSelect.appendChild(select);
//select.style.display = "none";
//1
//document.querySelectorAll('.selectMultiple ul li').forEach((li) => {
document.querySelector('.selectMultiple ul').addEventListener('click', (e) => {
    let li = e.target.closest('li');
    if(!li){return;}
    let select = li.closest('.selectMultiple');
    if(!select.classList.contains('clicked')){
        select.classList.add('clicked');
        if(li.previousElementSibling){
            li.previousElementSibling.classList.add('beforeRemove');
        }
        if(li.nextElementSibling){
            li.nextElementSibling.classList.add('afterRemove');
        }
        li.classList.add('remove');
        let a = document.createElement('a');
        a.dataset.value = li.dataset.value;
        a.innerHTML = "<em>"+li.innerText+"</em>";
        a.classList.add('notShown');
        // a.style.display = "none";
        select.querySelector('div').appendChild(a); //might have to check later
        let selectEl = select.querySelector('select');
        let opt = selectEl.querySelector('option[value="'+li.dataset.value+'"]');
        opt.setAttribute('selected', 'selected');
        setTimeout(() => {
            a.classList.add('shown');
            select.querySelector('span').classList.add('hide');
            // if(select.querySelector('option').innerText == li.innerText){
            // 	select.querySelector('option').selected
            // }

        }, 300);
        //1st
        setTimeout(() => {
            let styles = window.getComputedStyle(li);
                let liHeight = styles.height;
                let liPadding = styles.padding;
                let removing = li.animate([
                    {
                        height: liHeight,
                        padding: liPadding
                    },
                    {
                        height: '0px',
                        padding: '0px'
                    }
                ], {
                    duration: 300, easing: 'ease-in-out'
                });
                removing.onfinish = () => {
                    if(li.previousElementSibling){
                        li.previousElementSibling.classList.remove('beforeRemove');
                    }
                    if(li.nextElementSibling){
                        li.nextElementSibling.classList.remove('afterRemove');
                    }
                    li.remove();
                    select.classList.remove('clicked');
                }
//             setTimeout(() => {
//                 if(li.previousElementSibling){
//                     li.previousElementSibling.classList.remove('beforeRemove');
//                 }
//                 if(li.nextElementSibling){
//                     li.nextElementSibling.classList.remove('afterRemove');
//                 }
                
//             }, 200);
        }, 300); //600
			//2nd
    }
});
//2
//document.querySelectorAll('.selectMultiple > div a').forEach((a) => {
document.querySelector('.selectMultiple > div').addEventListener('click', (e) => {
    let a = e.target.closest('a');
    let select = e.target.closest('.selectMultiple');
    if(!a){return;}
    a.className = '';
    a.classList.add('remove');
    select.classList.add('open');
    let selectEl = select.querySelector('select');
    let opt = selectEl.querySelector('option[value="'+a.dataset.value+'"]');
    opt.removeAttribute('selected');
    //setTimeout(() => {
        a.classList.add('disappear');
        setTimeout(() => {
            // start animation
            let styles = window.getComputedStyle(a);
            let padding = styles.padding;
            let deltaWidth = styles.width;
            let deltaHeight = styles.height;

            let removeOption = a.animate([
                {
                    width: deltaWidth,
                    height: deltaHeight,
                    padding: padding
                },
                {
                    width: '0px',
                    height: '0px',
                    padding: '0px'
                }
            ], {
                duration: 0,
                easing: 'ease-in-out'
            });
            
            let li = document.createElement('li');
            li.dataset.value = a.dataset.value;
            li.innerText = a.querySelector('em').innerText;
            li.classList.add('show');
            select.querySelector('ul').appendChild(li);
            setTimeout(() => {
                if(!selectEl.selectedOptions.length){
                    select.querySelector('span').classList.remove('hide');
                }
                li.className = '';
            }, 350);
            
            removeOption.onfinish = () => {
                a.remove();
            }
            //end animation

        }, 300);
    //}, 400);
});
//});
//3
document.querySelectorAll('.selectMultiple > div .arrow, .selectMultiple > div span').forEach((el) => {
	el.addEventListener('click', (e) => {
		el.closest('.selectMultiple').classList.toggle('open');
	});
});