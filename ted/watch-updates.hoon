::  development tool to see `update:alz`s that result from
::   pokes to `app/alzabo.hoon`.
::   usage:
::   1. create project
::   2. run this thread to print out `update:alz`s for
::      that project
::   3. press Backspace to detatch thread
::   4. run whatever pokes/test-steps;
::      `update:alz`s will be output
::
/-  spider
/+  strandio
::
=*  strand     strand:spider
=*  take-fact  take-fact:strandio
=*  watch-our  watch-our:strandio
::
=/  m  (strand ,vase)
=|  subject=vase
|^  ted
::
+$  arg-mold
  $:  iterations=(unit @ud)
  ==
::
++  ted
  ^-  thread:spider
  |=  args-vase=vase
  ^-  form:m
  =/  args  !<((unit arg-mold) args-vase)
  ?~  args
    ~&  >>>  "Usage:"
    ~&  >>>  "-alzabo!watch-update iterations=(unit @ud)"
    (pure:m !>(~))
  =*  iterations    iterations.u.args
  ::
  =|  counter=@ud
  =/  watch-wire=wire  /update
  ;<  ~  bind:m  (watch-our watch-wire %alzabo watch-wire)
  |-
  ?:  &(?=(^ iterations) =(u.iterations counter))
    ~&  %zts^%done
    (pure:m !>(~))
  ;<  result=cage  bind:m  (take-fact watch-wire)
  ~&  %zts^p.result^(noah q.result)
  $(counter +(counter))
--