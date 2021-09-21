### IRLC Basic Mailer

**Case:** we want to collect photos of the paperwork from our students once they're done.

**Problem:** mail server delays from China to Russia which took up to several hours depending on many factors, one of them is attachment size.

**Solution:** compress/resize image on the client side then send to the designated e-mail address.

This tool is intended to provide students with a basic form to send their paperwork to the university mail servers.

#### TODO:
1. Fix live reload for webpack
1. Add i18n support and translations
1. Add captcha-like keypass support
1. Add HEIC support/converter for MIME image/heic
