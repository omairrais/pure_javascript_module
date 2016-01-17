(function() {
    var articlewidget = {};
        articlewidget.models;
        articlewidget.sort_by_time = false;

    articlewidget.ui = {
        article_container: "article_container",
        article_search_input: "article_search_input",
        sort_by_time: "sort_by_time"
    }


    articlewidget.settings = {}

    articlewidget.init = function(options) {
        if(options){
            if(typeof options.count == "undefined"){ this.settings.count = '';
            }else{ this.settings.count = options.count; }

            if(typeof options.related_stories == "undefined"){ this.settings.related_stories = true;
            }else{ this.settings.related_stories = options.related_stories; }

        }else{
            this.settings.count = '' ;
            this.settings.related_stories = true;
        }

        this.getArticles();
    }
    articlewidget.getArticles = function() {
        var self = this, loader;

            loader = document.createElement("div");
            loader.className = 'loader';
            loader.innerHTML = "loading in progress...";

        var container = document.getElementById(this.ui.article_container);
            container.appendChild(loader);

            self.models = Service.models(self.settings.count);
            self.renderArticles(self.models);
            self.bindSearchWithArticles();
            self.bindTimeSorter();
    }
    articlewidget.bindSearchWithArticles = function(){
        var self = this, search_input = document.getElementById(this.ui.article_search_input);

        search_input.onkeyup = function () {
            var term = search_input.value.toUpperCase();
            var item = document.getElementsByTagName('li');
            for (var i = 0; i < item.length; i++) {
                if(term === '' || self.getTextFromChildrens(item[i]).toUpperCase().indexOf(term) > -1){
                    item[i].style.display = 'list-item';
                }else{
                    item[i].style.display = 'none';
                }
            }
        }
    }
    articlewidget.bindTimeSorter = function(){
        var elem = document.getElementById(this.ui.sort_by_time), self=this;
        elem.onclick = function(){
            if(self.sort_by_time){
                self.sort_by_time=false;
            }else{
                self.sort_by_time = true;
            }
            elem.className = "sort_"+self.sort_by_time;
            self.renderArticles(self.models, self.sort_by_time);
        }
    }
    articlewidget.renderArticles = function(models, sort_by_time){
        var container = document.getElementById(this.ui.article_container), self = this, models, articles_ul;
            container.innerHTML = "";

            models = models.sort(function comp(a, b) {
                if(!sort_by_time){
                    return new Date(a.publishedDate).getTime() < new Date(b.publishedDate).getTime();
                }
                return new Date(a.publishedDate).getTime() > new Date(b.publishedDate).getTime();
            } )

            articles_ul = document.createElement("ul");
            articles_ul.className = "articles_list";

        for(var x in models){
            var articles_li = document.createElement("li");
                articles_li.index = x;
                articles_li.innerHTML = articlewidget.models[x].title;
                articles_ul.appendChild(articles_li);
                articles_li.onclick = self.showFullArticle;

            var content_span = document.createElement("span");
                content_span.innerHTML = articlewidget.models[x].content;
                content_span.className = "content";

            //var date_div = document.createElement("div"); // just wanted to test the sort by time.
            //date_div.innerHTML = articlewidget.models[x].publishedDate;
            //articles_li.appendChild(date_div);

                articles_li.appendChild(content_span);
        }

        container.appendChild(articles_ul);
    }
    articlewidget.showFullArticle = function(){
        var model = articlewidget.models[this.index],
            total_related_stories = model.relatedStories,
            elem, light_box, title, content, image, read_more, back_button, self=articlewidget;

            elem = document.getElementById("light_box");
            if(elem){ document.body.removeChild(elem); }

            light_box = document.createElement("div");
            light_box.id = "light_box";
            light_box.className = "light_box";

            title = document.createElement("h2");
            title.innerHTML = model.title;

            content = document.createElement("p");
            content.innerHTML = model.content;

            image = document.createElement("img");
            image.src = model.image.url;
            image.alt = model.image.publisher;

            read_more = document.createElement("a");
            read_more.innerHTML = "[read more]";
            read_more.href = model.unescapedUrl;
            read_more.target = "_blank";

            back_button = document.createElement("div");
            back_button.className = "back_button";
            back_button.innerHTML = "&leftarrow; ";
            back_button.onclick = self.goBackToArticle;

            light_box.appendChild(back_button);
            light_box.appendChild(title);
            light_box.appendChild(image);
            content.appendChild(read_more);
            light_box.appendChild(content);

        if(total_related_stories && self.settings.related_stories){
                var related_stories_heading,
                    related_stories;

                related_stories_heading = document.createElement("h3");
                related_stories_heading.innerHTML = "Related Stories";

                related_stories = document.createElement("ul");
                related_stories.className = "relatedStories";

                for(var x in total_related_stories){
                        var stories_li = document.createElement("li");

                        var stories_link = document.createElement("a");
                            stories_link.innerHTML = total_related_stories[x].title;
                            stories_link.href = total_related_stories[x].unescapedUrl;
                            stories_link.target = "_blank";

                        var date_span = document.createElement("span");
                            date_span.innerHTML = total_related_stories[x].publishedDate;
                            date_span.className = "date";

                        var publisher_span = document.createElement("span");
                            publisher_span.innerHTML = total_related_stories[x].publisher;
                            publisher_span.className = "author";

                        stories_li.appendChild(stories_link);
                        stories_li.appendChild(publisher_span);
                        stories_li.appendChild(date_span);
                        related_stories.appendChild(stories_li);
                }

            light_box.appendChild(related_stories_heading);
            light_box.appendChild(related_stories);
        }

        document.body.appendChild(light_box);
    }

    articlewidget.goBackToArticle = function() {
        var elem = document.getElementById("light_box");
        if(elem){ document.body.removeChild(elem); }
    }

    articlewidget.getTextFromChildrens = function(elem) {
        var node, ret = "", i = 0, nodeType = elem.nodeType, self = this;
        if ( !nodeType ) {
            while ( (node = elem[i++]) ) { ret += self.getTextFromChildrens( node ); }
        } else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
            if ( typeof elem.textContent === "string" ) {
                return elem.textContent;
            } else {
                for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                    ret += self.getTextFromChildrens( elem );
                }
            }
        } else if ( nodeType === 3 || nodeType === 4 ) { // for comment or other un related nodes
            return elem.nodeValue;
        }
        return ret;
    }


    window.ArticleWidget = articlewidget;
})();
