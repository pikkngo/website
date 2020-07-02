;(function () {
    authantication((e) => {
        console.log(e)
        if (e.auth) {
            window.location = "/home"
        } else {
            document.querySelector(".loading").style.display = "none"
        }
    })

    const root = document.querySelector(".root")
    root.addEventListener("DOMSubtreeModified", dosomething)

    //otp verification
    function sendOTP(phoneNumber, appVerifier) {
        console.log("sending")
        let = firebase
            .auth()
            .signInWithPhoneNumber(phoneNumber, appVerifier)
            .then(function (confirmationResult) {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                window.confirmationResult = confirmationResult
            })
            .catch(function (err) {
                document.querySelector(".otp").style.display = "none"
                document.querySelector(".next").innerHTML = "Next"
                error(err.message)
            })
    }
    function error(text) {
        let er = document.querySelector(".error")
        er.style.display = "block"
        er.innerText = text
        setTimeout(() => {
            er.style.display = "none"
        }, 4000)
    }

    function dosomething() {
        let hash = location.hash.slice(1)
        switch (hash) {
            case "login": {
                login()
                break
            }
            case "signup": {
                signup()
                break
            }
        }
    }
    function login() {
        let username = document.querySelector(".username")
        let password = document.querySelector(".password")
        let signin_btn = document.querySelector(".login_submit")

        signin_btn.onclick = () => {
            window.data = {
                username: username.value || 0,
                password: password.value || 0,
            }
            let tf = false
            for (let d in window.data) {
                if (window.data[d] == 0) {
                    tf = true
                    break
                }
            }
            if (!tf) {
                POST(`${baseURL}/users/login`, window.data, (e) => {
                    if (e.signin) {
                        cookie.setItem("token", e.token)
                        location.href = "/home"
                    } else error(e.message)
                })
            } else error("Can't leave any field empty")
        }
    }
    function signup() {
        let fname = document.querySelector(".firstname")
        fname.focus()
        let lname = document.querySelector(".lastname")
        let username = document.querySelector(".username")
        let email = document.querySelector(".email")
        let mno = document.querySelector(".mobile")
        let password = document.querySelector(".password")
        let next = document.querySelector(".next")

        next.onclick = () => {
            window.data = {
                fname: fname.value || 0,
                lname: lname.value || 0,
                email: email.value || 0,
                username: username.value || 0,
                mno: mno.value || 0,
                password: password.value || 0,
            }
            let tf = false
            for (let d in window.data) {
                if (window.data[d] == 0) {
                    tf = true
                    break
                }
            }
            if (!tf) {
                let otp = document.querySelector(".otp")
                window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
                    "recap",
                    {
                        size: "invisible",
                        callback: function (response) {
                            otp.style.display = "block"
                            recaptcha = true
                        },
                    }
                )
                sendOTP(window.data.mno, window.recaptchaVerifier)
                // //Test
                // POST("/users/signup", window.data, (e) => {
                //     if (e.signup) {
                //         window.location.href = "/home"
                //     } else {
                //         error(e.message)
                //     }
                // })
            } else error("Can't Leave any field empty")
        }
        let submit = document.querySelector(".signup_submit")
        submit.onclick = () => {
            let code = document.querySelector(".code")
            if (code.value) {
                window.confirmationResult
                    .confirm(code.value)
                    .then((result) => {
                        if (result) {
                            POST(
                                `${baseURL}/users/signup`,
                                window.data,
                                (e) => {
                                    if (e.signup) {
                                        cookie.setItem("token", e.token)
                                        window.location.href = "/home"
                                    } else {
                                        error(e.message)
                                    }
                                }
                            )
                        }
                    })
                    .catch((err) => {
                        document.querySelector(".resend_code").disabled = false
                        error(err.message)
                    })
            } else {
                error("Enter the OTP")
            }
        }
        document.querySelector(".resend_code").onclick = () => {
            sendOTP(window.data.mno, window.recaptchaVerifier)
        }
    }
})()
