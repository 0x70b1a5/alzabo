/-  alz=alzabo,
    spider
/+  agentio,
    strandio,
    dbug,
    default-agent,
    verb,
    lib=alzabo
::
=,  strand=strand:spider
|%
+$  card  card:agent:gall
--
::
=|  state-0:alz
=*  state  -
::
%-  agent:dbug
%+  verb  &
^-  agent:gall
|_  =bowl:gall
+*  this  .
    def      ~(. (default-agent this %|) bowl)
    io       ~(. agentio bowl)
::
++  on-init  `this
::
++  on-save  !>(state)
::
++  on-load
  |=  =old=vase
  `this(state !<(state-0:alz old-vase))
::
++  on-leave  on-leave:def
++  on-fail   on-fail:def
++  on-watch  |=  p=path  (on-watch:def p)
++  on-agent  |=  [w=wire =sign:agent:gall]  (on-agent:def w sign)
++  on-arvo   |=  [w=wire =sign-arvo:agent:gall]  (on-arvo:def w sign-arvo)
::
++  on-peek
  |=  p=path
  ^-  (unit (unit cage))
  |^
  =,  format
  ~&  >>  p
  ?+    +.p  (on-peek:def p)
      [%collections ~]
    ~  :: ``[%json (get "http://localhost:8000/collections")]
      [%collection @ ~]
    ~  :: ``[%json (get "http://localhost:8000/collection/")]
  ==
  ++  get
    |=  url=cord
    ^-  @t
    =/  m  (strand ,json)
    ^-  form:m
    ;<  res=json  bind:m  (fetch-json:strandio url)
    :: ???
  --
::
++  on-poke
  |=  [m=mark v=vase]
  ^-  (quip card _this)
  |^
  =^  cards  state
    ?+  m  (on-poke:def m v)
      %alzabo-action  (handle-poke !<(action:alz v))
    ==
  [cards this]
  ::
  ++  handle-poke
    |=  act=action:alz
    ^-  (quip card _state)
    ?>  =(our.bowl src.bowl)
    ~&  >  "poked with act:"
    ~&  >  act
    ~&  >  "current state:"
    ~&  >  state
    ?-    -.+.act
        %create
      `state
        %delete
      `state
        %add-document
      `state
        %query
      `state
        %reset
      `state
        %save-api-key
      =/  key  key.+.+.act
      ~&  >  'got key'
      ~&  >  key
      `state(api-key key)
    ==
  --
--