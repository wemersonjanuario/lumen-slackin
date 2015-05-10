var app = {
    config:{
        'debug': false
    },

    Listeners:{}
};

app.Listeners.UsersActivity = {
    whenActivity: function(data){
        if(app.config.debug){
            console.log(data);
        }

        $('#status').html(Lang.choice('slackin.users_online', data.active, data));
    }
};

var socket = io('http://localhost:8080');
socket.on('local:UsersActivity', app.Listeners.UsersActivity.whenActivity);


$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$(document).ready(function(){
    $('#form-invite form').submit(function(e){
        e.preventDefault();

        var $form = $(this);

        var data = $form.serializeObject();

        $.ajax({
            url: $(this).attr('action'),
            type: 'post',
            data: data,
            dataType: 'json',

            success: function(data){
                $form.hide();
                $('#validation-message').removeClass('text-danger').addClass('text-success').html(data.message);
            },

            error: function(data){
                validation = data.responseJSON;

                if(validation != undefined){
                    if(validation.email){
                        var emailField = $('[name="email"]', $form);

                        emailField.parents('.form-group').addClass('has-error');
                        emailField.siblings('.help-block').html(validation.email);
                    }

                    if(validation.username){
                        var usernameField = $('[name="username"]', $form);

                        usernameField.parents('.form-group').addClass('has-error');
                        usernameField.siblings('.help-block').html(validation.username);
                    }
                }

                $('#validation-message').removeClass('text-success').addClass('text-danger').html(Lang.get('validation.wrong'));
            }
        });

    });
});
