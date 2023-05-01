/-  spider
/+  strandio
=,  strand=strand:spider
=,  strand-fail=strand-fail:libstrand:spider
^-  thread:spider
|=  url=vase
?~  yurl=!<((unit tape) url)  !!
~&  >>  "GET {u.yurl}"
=/  m  (strand ,vase)
^-  form:m
;<  res=cord  bind:m  (fetch-cord:strandio u.yurl)
(pure:m !>(res))