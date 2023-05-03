/-  spider
/+  io=strandio
=,  strand=strand:spider
=,  strand-fail=strand-fail:libstrand:spider
^-  thread:spider
|=  req=vase
=/  unit-req  !<((unit [url=cord heds=(list [@t @t]) body=cord]) req)
?~  unit-req  !!
~&  >>  "POST {(trip url.u.unit-req)}"
=/  m  (strand ,vase)
^-  form:m
=/  =request:http  [%'POST' url.u.unit-req heds.u.unit-req `(as-octs:mimes:html body.u.unit-req)]
;<  ~                      bind:m  (send-request:io request)
;<  =client-response:iris  bind:m  take-client-response:io
;<  res=cord               bind:m  (extract-body:io client-response)
(pure:m !>(res))