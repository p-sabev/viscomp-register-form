    var Html = (function(){
        function Html() {
            return this;
        }

        Html.prototype.batcher = function(method, tagName, arr){
            return arr.reduce(function(x, y){
                return x += this[method](y, tagName);
            }.bind(this), "");
        };

        Html.prototype.insertIntoDom = function(parent, content){
            return parent.innerHTML = content;
        };

        Html.prototype.addIntoDom = function(parent, content){
            return parent.innerHTML += content;
        };

        Html.prototype.wrapInTag = function(tagName, content, clas, id){
            id = typeof id === "undefined" ? "" : 'id="'+id+'"';
            clas = typeof clas === "undefined" ? "" : 'class="'+clas+'"';
            return '<' + tagName + ' ' + clas +' ' + id + '>' + content + ' </' + tagName + '>';
        };

        Html.prototype.buildFromArray = function(arr, HtmlTag){
            var tmp = '',
            HtmlTag = typeof HtmlTag === "undefined" ? "div" : HtmlTag;
            arr.forEach(function(el){
                return tmp += this.wrapInTag(HtmlTag, el || " ");
            }.bind(this));
            return tmp;
        };

        Html.prototype.buildFromArrayWithObject = function(obj){
            var tmp = '';
            for (let i in obj){
                tmp += this.wrapInTag(obj[i].tagName, obj[i].content);
            }
            return tmp;
        };

        Html.prototype.cicleWrapObjByKeys = function(tag, i, arr, keys) {
            var tmp = '', j, l = keys.length;
            for (j = 0; j < l; j++) {
                tmp += this.wrapInTag(tag, arr[i][keys[j]] || " ");
            }
            return tmp;
        };

        Html.prototype.cicleWrapObj = function(obj, HtmlTag) {
            var tmp = '',
            HtmlTag = typeof HtmlTag === "undefined" ? "h2" : HtmlTag;

            return tmp;
        };

        Html.prototype.hasClass = function(el, className) {
            if (el.classList){
                return el.classList.contains(className);
            }else {
                return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
            }
        }

        Html.prototype.addClass = function(el, className) {
            if (el.classList){
                return el.classList.add(className);
            }

            else if(!hasClass(el, className)){
                return el.className += " " + className;
            }
        }

        Html.prototype.removeClass = function(el, className) {
            if (el.classList){
                return el.classList.remove(className);
            } else if (hasClass(el, className)) {
                var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                return el.className=el.className.replace(reg, ' ');
            }
        }

        if (!(this instanceof Html)) {
            return new Html();
        }
    }());


    window.onload = function() {
        var el = document.getElementById('userForm');
        Html.removeClass(el, 'hidden');
    }

    var registerForm = (function (Html) {

        var counter = 0,
        userKeys = ['first_name', 'surname', 'last_name', 'username', 'email', 'phone_number'],
        addressKeys = ['address_row_1', 'address_row_2', 'post_code', 'city', 'area', 'country'],
        notesKeys = ['note'],
        forms = ['userForm', 'addressForm', 'notesForm', 'successForm'],
        progress = ['progressUser', 'progressAddress', 'progressNote'],
        next = true,
        note = 1;

        function submitUser(){
            var user = {
                first_name:  document.querySelector("#first_name").value ,
                surname:  document.querySelector("#surname").value ,
                last_name:  document.querySelector("#last_name").value ,
                username:  document.querySelector("#username").value ,
                email:  document.querySelector("#email").value ,
                phone_number:  document.querySelector("#phone_number").value
            };

            ajax('user', user);
        }

        function submitAddress(arg){
            next = arg;

            var data = {
                address_row_1:  document.querySelector("#address_row_1").value ,
                address_row_2:  document.querySelector("#address_row_2").value ,
                post_code:  document.querySelector("#post_code").value ,
                city:  document.querySelector("#city").value ,
                area:  document.querySelector("#area").value ,
                country:  document.querySelector("#country").value
            };

            ajax('address', data);
        }

        function submitNote(arg){
            next = arg;

            var data = {
                next: arg,
                note:  document.querySelector("#note").value
            };

            ajax('note', data);

            (!arg) ? displayNewNote(note + 1) : void(0);
        }

        function visualizeData(data){
            var user = data[0],
            address = data[1],
            notes = data[2];

            userLabels = ["Име:","Презиме:","Фамилия:","Потребителско име:","Имейл:","Телефон:"];
            var userHtml = '';
            for (let i = 0; i < userLabels.length; i++) {
                let tmp = '';
                let label = Html.wrapInTag("h2", userLabels[i], "label");
                tmp += Html.wrapInTag("div", label, "col-2 float-left");
                let info = Html.wrapInTag("h2", user[userKeys[i]], "value");
                tmp += Html.wrapInTag("div", info, "col-2 float-left");
                userHtml += Html.wrapInTag("div", tmp, "holdsInfo clearfix");
            }
            Html.addIntoDom(document.querySelector("#userInfo"), userHtml);

            var addressHtml = '';
            for (let i = 0; i < address.length; i++) {
                let tmp = '',
                allAdress = '';

                allAdress = (i+1) + ".        " + address[i][addressKeys[0]] + ", " + address[i][addressKeys[1]] + "<br>" + "   " +  address[i][addressKeys[4]] + " " + address[i][addressKeys[2]] + "<br>"  + "   " + address[i][addressKeys[3]] + " " + address[i][addressKeys[5]];
                addressHtml = Html.wrapInTag("p", allAdress, "holdsAddress address");
                Html.addIntoDom(document.querySelector("#addressInfo"), addressHtml);
            }

            for (let i = 0; i < notes.length; i++) {
                var notesHtml = Html.wrapInTag("p", ((i+1) + ".        " + notes[i]), "holdsAddress address");
                Html.addIntoDom(document.querySelector("#notesInfo"), notesHtml);
            }
        }

        function displayNewNote(arg){
            note = arg;
            newNote = '<div class="col-4"><input name="note" id="note" class="note input" placeholder="Нова бележка ' + arg + '"></div>';
            return document.querySelector("#notesForm").insertAdjacentHTML('afterbegin', newNote);
        }

        function ajax(name, data){
            request = new XMLHttpRequest();
            request.addEventListener("load", handler);
            request.open("POST", "php/" + name + "Handler.php", true);
            request.send(JSON.stringify(data));
        }

        function handler(e){
            var allForms = [userKeys, addressKeys, notesKeys];
            var currentForm = allForms[counter];
            console.log(e);
            if(e.currentTarget.response !== ''){
                if (e.currentTarget.status === 999) {
                    el = document.getElementById('progressbar');
                    Html.addClass(el, 'hidden');

                    var data = JSON.parse(e.currentTarget.response);
                    visualizeData(data);

                    changeClasses();

                 }else{

                    var errors = JSON.parse(e.currentTarget.response);
                    return displayErrors(currentForm, errors);

                 }
            }else {
                if(next){
                    changeClasses();
                }else{
                    document.getElementById('addressForm').reset();
                }
            }
        }

        function changeClasses(){
            var el = document.getElementById(forms[counter]);
            var progressEl = document.getElementById(progress[counter]);
            Html.removeClass(progressEl, 'active');
            Html.addClass(el, 'hidden');

            counter++;

            var el = document.getElementById(forms[counter]);
            var progressEl = document.getElementById(progress[counter]);
            Html.removeClass(el, 'hidden');
            (counter!==3) && Html.addClass(progressEl, 'active');
        }


        function displayErrors(form, data){
            form.forEach(function(element) {
                document.getElementById(element).style.border = '2px solid gray';
            });
            data.forEach(function(element) {
                document.getElementById(element).style.border = '2px solid red';
            });
        }

        return {
            submitUser: submitUser,
            submitAddress: submitAddress,
            submitNote: submitNote
        };

    })(Html);
