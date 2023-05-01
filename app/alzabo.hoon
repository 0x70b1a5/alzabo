/-  alz=alzabo,
    spider
/+  agentio,
    strandio,
    dbug,
    default-agent,
    verb,
    lib=alzabo
::
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
++  on-watch  
  |=  p=path
  ?+  p  (on-watch:def p)
      [%update ~]
    `this
  ==
++  on-agent  |=  [w=wire =sign:agent:gall]  (on-agent:def w sign)
++  on-arvo   
  |=  [w=wire =sign-arvo:agent:gall]
  ^-  (quip card _this)
  |^
  ?+  w  (on-arvo:def w sign-arvo)
      [%get-collections ~]
    (return-update 'got-collections')
  ::
      [%create-collection ~]
    (return-update 'created-collection')
  ==
  ++  return-update
    |=  print=@t
    ?.  ?&  ?=(%khan -.sign-arvo)
            ?=(%arow -.+.sign-arvo)
        ==
        (on-arvo:def w sign-arvo)
    ?:  ?=(%| -.p.+.sign-arvo)
      ~&  >  'khan error'
      ~&  >  +.p.+.sign-arvo
      !!
    =+  !<(result=cord q.p.p.+.sign-arvo)
    ~&  >  print
    ~&  >  result
    :: just send the json as a noun
    :_  this
    :_  ~  [%give %fact ~[/update] [%json !>(s+result)]]
  --
++  on-peek   on-peek:def
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
        %get-collections
      :_  state
      :_  ~
      (request-card /get-collections %get !>(`"{base}/collections"))
    ::
        %get-collection
      :_  state
      :_  ~
      (request-card /get-collection %get !>(`"{base}/collection/{(trip +.+.act)}"))
    ::
        %create
      :_  state
      :_  ~
      (request-card /create-collection %post !>(`[(crip "{base}/collections") +.+.act]))
    ::
        %delete
      `state
    ::
        %add-document
      `state
    ::
        %query
      `state
    ::
        %reset
      `state
    ::
        %save-api-key
      =/  key  key.+.+.act
      ~&  >  'got key'
      ~&  >  key
      `state(api-key key)
    ==
  ++  base  "http://localhost:8000/api/v1"
  ++  request-card
    |=  [pax=path method=@tas body=vase]
    [%pass pax %arvo %k %fard %alzabo method %noun body]
  --
--