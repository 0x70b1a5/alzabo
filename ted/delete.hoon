/-  spider
/+  io=strandio
=,  strand=strand:spider
=,  strand-fail=strand-fail:libstrand:spider
^-  thread:spider
|=  url=vase
?~  yurl=!<((unit tape) url)  !!
~&  >>  "DELETE {u.yurl}"
=/  m  (strand ,vase)
^-  form:m
=/  =request:http  [%'DELETE' (crip u.yurl) ~ ~]
;<  ~                      bind:m  (send-request:io request)
;<  =client-response:iris  bind:m  take-client-response:io
;<  res=cord               bind:m  (extract-body:io client-response)
(pure:m !>(res))