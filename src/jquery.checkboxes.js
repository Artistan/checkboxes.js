/*! Checkbox.js - MIT - Rubens Mariuzzo */
! function($) {

    //////////////////////////////////
    /* Checkboxes class definition. */
    //////////////////////////////////

    var Checkboxes = function($context, options) {
        this.$context = $context;
    };

    // Check all checkboxes in context.
    Checkboxes.prototype.check = function() {
        this.$context.find(':checkbox').prop('checked', true);
    };

    // Uncheck all checkboxes in context.
    Checkboxes.prototype.uncheck = function() {
        this.$context.find(':checkbox').prop('checked', false);
    };

    // Toggle the state of all checkboxes in context.
    Checkboxes.prototype.toggle = function() {
        this.$context.find(':checkbox').each(function() {
            var $checkbox = $(this);
            $checkbox.prop('checked', ! $checkbox.is(':checked'));
        });
    };

    // Set the maximum number of checkboxes that can be checked.
    Checkboxes.prototype.max = function(max) {
        if (max == 0) {
            // Disable max.
            this.$context.off('click.checkboxes');
        } else if (max > 0) {
            // Enable max.
            var instance = this;
            this.$context.on('click.checkboxes.max', ':checkbox', function(e) {
                if (instance.$context.find(':checked').length == max) {
                    instance.$context.find(':checkbox:not(:checked)').prop('disabled', true);
                } else {
                    instance.$context.find(':checkbox:not(:checked)').prop('disabled', false);
                }
            });
        }
    };

    // Enable or disable range selection.
    Checkboxes.prototype.range = function(enable) {
        if (enable) {
            var instance = this;
            this.$context.on('click.checkboxes.range', ':checkbox', function(e) {
                var $checkbox = $(e.target);
                if (e.shiftKey && instance.$last && ($checkbox.prop('checked') == instance.$last.prop('checked'))) {
                    var $checkboxes = instance.$context.find(':checkbox'),
                        from = $checkboxes.index(instance.$last),
                        to = $checkboxes.index($checkbox),
                        start = Math.min(from, to),
                        end = Math.max(from, to);
                    $checkboxes.slice(start, end).prop('checked', true);
                }
                instance.$last = $checkbox.is(':checked') ? $checkbox : null;
            });
        } else {
            this.$context.off('click.checkboxes.range');
        }
    };

    ///////////////////////////////////
    /* Checkboxes plugin definition. */
    ///////////////////////////////////

    var old = $.fn.checkboxes;

    $.fn.checkboxes = function(method) {
        var methodArgs = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var $this = $(this),
                data = $this.data('checkboxes');
            if (!data) {
                $this.data('checkboxes', (data = new Checkboxes($this, typeof method == 'object' && method)));
            }
            if (typeof method === 'string') {
                data[method].apply(data, methodArgs);
            }
        });
    };

    $.fn.checkboxes.Constructor = Checkboxes;


    /////////////////////////////
    /* Checkboxes no conflict. */
    /////////////////////////////

    $.fn.checkboxes.noConflict = function() {
        $.fn.checkboxes = old;
        return this;
    };


    //////////////////////////
    /* Checkboxes data-api. */
    //////////////////////////

    $(document).on('click.checkboxes.data-api', '[data-toggle^=checkboxes]', function(e) {
        var el = $(e.target),
            href = el.attr('href'),
            $context = $(el.data('context') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))),
            action = el.data('action');
        e.preventDefault();
        $context.checkboxes(action);
    });

}(window.jQuery);