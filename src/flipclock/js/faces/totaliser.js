(function($) {
		
	FlipClock.TotaliserFace = FlipClock.CounterFace.extend({
            shouldAutoIncrement: false,
            constructor: function(factory, options) {

                this.base(factory, options);

                this.startValue = this.makeCounterValue(this.startValue);
                this.currentValue = this.makeCounterValue(this.currentValue);

                this.factory.classes.comma = "flip-clock-comma";

                this.factory.separatorClass = options.separator === "." ?
                    this.factory.classes.dot :
                    this.factory.classes.comma;
            },
            createDivider: function() {
                var dots = [
                        "<span class='" + this.factory.separatorClass + " bottom'></span>"
                    ].join(""),
                    html = [
                        "<span class='" + this.factory.classes.divider + "'>",
                        dots,
                        "</span>"
                    ];

                var $html = $(html.join(""));
                this.dividers.push($html);

                return $html;
            },

            /*
             * Will add leading zeros if the passed value length is less than
             * min digits setting.
             *
             * */
            makeCounterValue: function(value) {
                var startValueDiff = this.minimumDigits - value.length,
                    newValue = value;

                while (startValueDiff > 0) {
                    newValue = "0" + newValue;
                    startValueDiff = startValueDiff - 1;
                }

                return newValue;
            },

            build: function() {
                var self = this,
                    children = this.factory.$el.find("ul"),
                    time = this.startValue.split("");

                if (time.length > children.length) {
                    $.each(time, function(i, digit) {
                        self.createList(digit);
                    });
                }

                this.createDivider();
                this.createDivider();

                var listLength = this.lists.length;

                $(this.dividers[0]).insertBefore(this.lists[listLength - 3].$el);
                $(this.dividers[1]).insertBefore(this.lists[listLength - 6].$el);
            },

            countUp: function() {
                var finalValue = this.currentValue.split(""),
                    progressValue = this.startValue.split(""),
                    timeDigitsLength = finalValue.length,
                    self = this, countInterval;

                countInterval = setInterval(function() {
                    if (timeDigitsLength <= 0) {
                        self.factory.$el.find(".play").removeClass("play");
                        clearInterval(countInterval);
                        return;
                    }

                    timeDigitsLength = timeDigitsLength - 1;

                    if (progressValue[timeDigitsLength] === finalValue[timeDigitsLength]) {
                        return;
                    }

                    progressValue[timeDigitsLength] = finalValue[timeDigitsLength];
                    self.updateTime(progressValue.join(""), true);
                }, 500);
            },

            updateTime: function(time, doFlip) {
                this.factory.time = new FlipClock.Time(this.factory, time);

                if (doFlip) {
                    this.factory.flip();
                }
            }
        });
	
}(jQuery));