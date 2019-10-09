class TodoJS {
	constructor(elem, name_todo, todoList = []) {
		this.elem = document.querySelector(elem);
		this.elem.innerHTML = '';
		this.elem.classList.add('todo');
		this.name_todo = name_todo;
		this.todoList = todoList;
		this.constructorHeader(this.elem);
		this.constructorList(this.elem);
		this.constructorFooter(this.elem);
		this.generatorLine();

		this.elem.addEventListener('click', (event) => {
			event.preventDefault();

			let thisElem = event.target;
			const reg = /icon/;

			if (reg.test(event.target.className)) {
				thisElem = event.target.parentElement;
			}

			switch(thisElem.className) {
				case 'todo__add-button':
					this.addLine(thisElem);
					break;

				case 'todo__line-check':
					this.completeToggle(thisElem);
					break;

				case 'todo__edit':
					this.todoEdit();
					break;

				case 'todo__line-delete':
					this.deleteLine(thisElem);
					break;

				case 'todo__check-all':
					this.completeAll();
					break;

				case 'todo__clear-all':
					this.clearAll();
					break;

				case 'todo__filter-all':
					this.elem.classList.remove('todo-filterCheckout');
					this.elem.classList.remove('todo-filterCheckin');
					break;

				case 'todo__filter-checkin':
					this.elem.classList.remove('todo-filterCheckout');
					this.elem.classList.add('todo-filterCheckin');
					break;

				case 'todo__filter-checkout':
					this.elem.classList.remove('todo-filterCheckin');
					this.elem.classList.add('todo-filterCheckout');
					break;

			}
		});
	}

	constructorHeader(container) {
		let header = document.createElement('div');
		let headerName = document.createElement('h2');
		let headerEdit = document.createElement('a');

		header.className = 'todo__header';
		headerName.className = 'todo__name';
		headerEdit.className = 'todo__edit';
		headerEdit.href = '';

		headerName.innerHTML = `${this.name_todo} (<span class="todo__total-amount">${this.todoList.length}</span>)`;
		headerEdit.innerHTML = `<span class="icon-pencil"></span>`;

		container.prepend(header);
		header.append(headerName);
		header.append(headerEdit);
		this.constructorAddBlock(header);
	}

	constructorAddBlock(container) {
		let addBlock = document.createElement('div');
		let addInput = document.createElement('input');
		let addButton = document.createElement('a');

		addBlock.className = 'todo__add-block';
		addInput.className = 'todo__add-input';
		addButton.className = 'todo__add-button';
		addButton.href = '';

		addButton.innerHTML = '<span class="icon-plus"></span>';

		addInput.addEventListener('keydown', (e) => {
			if (e.keyCode === 13) {
				this.addLine(addInput);
			}
		});

		container.append(addBlock);
		addBlock.append(addInput);
		addBlock.append(addButton);
	}

	constructorList(container) {
		let list = document.createElement('div');

		list.className = 'todo__list';

		container.append(list);
	}

	constructorFooter(container) {
		let footer = document.createElement('div');
		let footerCheckAll = document.createElement('a');
		let footerFilterCheckIn = document.createElement('a');
		let footerFilterCheckOut = document.createElement('a');
		let footerFilterAll = document.createElement('a');
		let footerClearAll = document.createElement('a');

		footer.className = 'todo__footer';
		footerCheckAll.className = 'todo__check-all';
		footerFilterCheckIn.className = 'todo__filter-checkin';
		footerFilterCheckOut.className = 'todo__filter-checkout';
		footerFilterAll.className = 'todo__filter-all';
		footerClearAll.className = 'todo__clear-all';

		footerCheckAll.href = '';
		footerFilterCheckIn.href = '';
		footerFilterCheckOut.href = '';
		footerFilterAll.href = '';
		footerClearAll.href = '';

		footerCheckAll.innerHTML = 'Выбрать все';
		footerFilterCheckIn.innerHTML = 'Выполненные';
		footerFilterCheckOut.innerHTML = 'Невыполненные';
		footerFilterAll.innerHTML = 'Все';
		footerClearAll.innerHTML = 'Очистить';

		container.append(footer);
		footer.append(footerCheckAll);
		footer.append(footerFilterCheckIn);
		footer.append(footerFilterCheckOut);
		footer.append(footerFilterAll);
		footer.append(footerClearAll);
	}

	constructorLine(id, name, completed, edit = false) {
		let line = document.createElement('div');
		let lineName;
		let lineCheck = document.createElement('a');
		let lineDelete = document.createElement('a');
		if (edit) {
			lineName = document.createElement('input');
			lineName.value = name;
			lineName.oninput = () => {
				this.todoList[id].name = lineName.value;
			}
		} else {
			lineName = document.createElement('p');
			lineName.innerHTML = name;
		}

		line.className = 'todo__line';
		if (completed) {
			line.classList.add('todo__line-completed');
		};
		lineCheck.className = 'todo__line-check';
		lineName.className = 'todo__line-name';
		lineDelete.className = 'todo__line-delete';

		line.dataset.id = id;

		lineCheck.href = '';
		lineDelete.href = '';

		lineCheck.innerHTML = '<span class="icon-checkmark"></span>';
		
		lineDelete.innerHTML = '<span class="icon-plus"></span>';

		this.elem.querySelector('.todo__list').prepend(line);
		line.append(lineCheck);
		line.append(lineName);
		line.append(lineDelete);
	}

	generatorLine(edit = false) {
		this.elem.querySelector('.todo__list').innerHTML = '';
		this.elem.querySelector('.todo__total-amount').innerHTML = this.todoList.length;
		for (let [index, elem] of this.todoList.entries()) {
			elem.id = index;
			if (edit) {
				this.constructorLine(index, elem.name, elem.completed, edit);
				continue;
			}
			this.constructorLine(index, elem.name, elem.completed);
		}
	
	}

	addLine(thisElem) {
		let text = thisElem.parentElement.querySelector('input').value;
		if (text == '') {
			return
		}
		this.todoList.push({
			id: this.todoList.length,
			name: text,
			completed: false
		});
		this.generatorLine();
		thisElem.parentElement.querySelector('input').value = '';
	}

	completeToggle(thisElem) {
		let id = thisElem.parentElement.dataset.id;
		this.todoList[id].completed = !this.todoList[id].completed;
		thisElem.parentElement.classList.toggle('todo__line-completed');
	}

	todoEdit() {
		this.elem.classList.toggle('todo-edit-everything');
		if (this.elem.classList.contains('todo-edit-everything')) {
			this.generatorLine(true);
			return;
		}

		this.generatorLine();
	}

	deleteLine(thisElem) {
		let id = thisElem.parentElement.dataset.id; 
		this.todoList.splice(id, 1);
		this.generatorLine(true);
	}

	completeAll() {
		for (let elem of this.todoList) {
			elem.completed = true;
		}
		this.elem.classList.toggle('todo-edit-everything');
		this.todoEdit();
	}

	clearAll() {
		this.todoList.length = 0;
		this.generatorLine();
	}
}


