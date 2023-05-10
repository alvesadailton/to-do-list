{
    class ToDoList {
        constructor() {
            this.inputTask = document.querySelector('.input-task');
            this.btnAdd = document.querySelector('.add-button');
            this.tasks = document.querySelector('.list');
            this.completedTasks = document.querySelector('.list2');
            this.img = document.querySelector('.img-header');

            this.main();
        }

        main() {
            this.btnAdd.addEventListener('click', () => {
                if (!this.inputTask.value || !this.inputTask.value.replace(/[\\|₢?/!,.;:\]}º^~`´{[_()@#$%¨&*¹²³£¢¬§'"<>]/g, '').trim()) {
                    this.clearInput();
                    this.img.src = 'assets/img/warning.svg';
                    return this.createError();
                }
                this.createTasks(this.inputTask.value);
                this.img.src = 'assets/img/tasklist.svg';
                this.clearInput();
                this.saveTasks();
            });

            document.addEventListener('click', this.callBackDone);

            this.inputTask.addEventListener('focusin', () => {
                this.img.src = 'assets/img/typing.svg';
                this.removeError();
            });
            this.inputTask.addEventListener('blur', () => {
                this.img.src = 'assets/img/tasklist.svg';
            });

            document.addEventListener('click', e => {
                const el = e.target;
                if (el.classList.contains('remove')) {
                    el.parentElement.remove();
                }
                this.saveTasks();
            });

            document.addEventListener('keypress', e => {
                if (e.key === 'Enter') {
                    if (!this.inputTask.value || !this.inputTask.value.replace(/[\\|₢?/!,.;:\]}º^~`´{[_()@#$%¨&*¹²³£¢¬§'"<>]/g, '').trim()) {
                        this.clearInput();
                        this.img.src = 'assets/img/warning.svg';
                        return this.createError();
                    }
                    this.createTasks(this.inputTask.value);
                    this.img.src = 'assets/img/tasklist.svg';
                    this.clearInput();
                    this.saveTasks();
                }
            });

            this.addSaveTasks();
        }
        clearInput() {
            this.inputTask.value = '';
            this.inputTask.focus();
        }

        createLi() {
            const li = document.createElement('li');
            return li;
        }

        createP() {
            const p = document.createElement('p');
            return p;
        }

        createError() {
            const warning = document.querySelector('.warning');
            warning.style.display = 'block';
            warning.innerHTML = 'O campo não pode estar vazio e deve conter apenas letras e números!!';
        }

        removeError() {
            const warning = document.querySelector('.warning');
            warning.style.display = 'none';
        }

        createDoneButton(li) {
            const btnDone = document.createElement('button');
            btnDone.setAttribute('class', 'done');
            btnDone.setAttribute('title', 'Finalize a Tarefa');
            btnDone.innerHTML = '<span class="material-symbols-outlined">done</span>';
            li.appendChild(btnDone);
        }

        createRemoveButton(li) {
            const btnRemove = document.createElement('button');
            btnRemove.setAttribute('class', 'remove');
            btnRemove.setAttribute('title', 'Remova a Tarefa');
            btnRemove.innerHTML = '<span class="material-symbols-outlined">delete</span>';
            li.appendChild(btnRemove);
        }

        createTasks(textInput) {
            this.removeError();
            const li = this.createLi();
            const p = this.createP();
            li.setAttribute('class', 'task');
            this.tasks.appendChild(li);
            p.setAttribute('class', 'task-text');
            li.appendChild(p);
            p.innerHTML = textInput.replace(/[\\|₢?/!,.;:\]}º^~`´{[_()@#$%¨&*¹²³£¢¬§'"<>]/g, '').trim();
            this.createDoneButton(li);
            this.createRemoveButton(li);
        }

        callBackDone = e => {
            const el = e.target;
            if (el.classList.contains('done')) {
                this.doneTask(el);
            } else if (el.classList.contains('re-add')) {
                this.reAddTask(el);
            }
        };

        doneTask(el) {
            el.setAttribute('class', 're-add');
            el.setAttribute('title', 'Reative a Tarefa');
            el.innerHTML = '<span class="material-symbols-outlined">done_all</span>';
            this.completedTasks.appendChild(el.parentElement);
        }

        reAddTask(el) {
            el.setAttribute('class', 'done');
            el.setAttribute('title', 'Finalize a Tarefa');
            el.innerHTML = '<span class="material-symbols-outlined">done</span>';
            this.tasks.appendChild(el.parentElement);
        }
        createTasksDone(textInput) {
            const li = this.createLi();
            const p = this.createP();
            li.setAttribute('class', 'task');
            this.completedTasks.appendChild(li);
            p.setAttribute('class', 'task-text');
            li.appendChild(p);
            p.innerHTML = textInput.replace(/[\\|₢?/!,.;:\]}º^~`´{[_()@#$%¨&*¹²³£¢¬§'"<>]/g, '').trim();
            this.createReAddButton(li);
            this.createRemoveButton(li);
            this.saveTasks();
        }

        createReAddButton(li) {
            const btnReAdd = document.createElement('button');
            btnReAdd.setAttribute('class', 're-add');
            btnReAdd.setAttribute('title', 'Finalize a Tarefa');
            btnReAdd.innerHTML = '<span class="material-symbols-outlined">done_All</span>';
            li.appendChild(btnReAdd);
        }

        saveToLocalStorage({ json, key }) {
            localStorage.setItem(key, JSON.stringify(json));
        }

        getByLocalStorage({ key }) {
            const json = localStorage.getItem(key);
            return JSON.parse(json);
        }

        saveTasks() {
            const taskList = [];
            const taskListDone = [];

            if (this.reAddTask) {
                let liTasks = this.tasks.querySelectorAll('.done');

                for (let task of liTasks) {
                    let textTask = task.previousElementSibling.innerText;
                    taskList.push(textTask);
                }
                this.saveToLocalStorage({ key: 'tasks', json: taskList });
            }
            if (this.doneTask) {
                let liTasks2 = this.completedTasks.querySelectorAll('.re-add');

                for (let task of liTasks2) {
                    let textTask = task.previousElementSibling.innerText;
                    taskListDone.push(textTask);
                }
                this.saveToLocalStorage({ key: 'completedTasks', json: taskListDone });
            }
        }

        addSaveTasks() {
            const listTask = this.getByLocalStorage({ key: 'tasks' });
            const listCompletedTask = this.getByLocalStorage({ key: 'completedTasks' });

            if (listTask) {
                for (let task of listTask) {
                    this.createTasks(task);
                }
            }
            if (listCompletedTask) {
                for (let task of listCompletedTask) {
                    this.createTasksDone(task);
                }
            }
        }
    }
    new ToDoList();
}