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
    :_  this
    (return-update 'get-collections')
  ::
      [%get-collection ~]
    :_  this
    (return-update 'get-collection')
  ::
      [%create ~]
    :_  this
    (return-update 'create-collection')
  ::
      [%add-document ~]
    :_  this
    (return-update 'add-document')
  ::
      [%upsert-document ~]
    :_  this
    (return-update 'upsert-document')
  ::
      [%reset ~]
    :_  this
    (return-update 'reset')
  ::
      [%query ~]
    :_  this
    (return-update 'query')
  ::
      [%create-embeddings ~]
    :_  this
    (return-update 'create-embeddings')
  ==
  ++  return-update
    |=  update-type=@t
    ^-  (list card)
    ?.  ?&  ?=(%khan -.sign-arvo)
            ?=(%arow -.+.sign-arvo)
        ==
        (on-arvo:def w sign-arvo)
    ?:  ?=(%| -.p.+.sign-arvo)
      ~&  >  'khan error'
      ~&  >  +.p.+.sign-arvo
      !!
    =+  !<(result=cord q.p.p.+.sign-arvo)
    ~&  >  update-type
    ~&  >  result
    =/  final  
      (crip "\{ \"type\": \"{(trip update-type)}\", \"update\": {(trip result)} }")
    :: just send the json as a noun
    :_  ~  [%give %fact ~[/update] %alzabo-update !>(update+final)]
  --
++  on-peek
  |=  p=path
  ^-  (unit (unit cage))
  ~&  >>  'got scried'
  ~&  >>  p
  ?+    +.p  (on-peek:def p)
      [%has-api-key ~]
    ``json+!>(b+?!(=(~ `@`api-key.state)))
  ==
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
    =/  coll  -.act
    ~&  >  coll
    ?-    -.+.act
        %get-collections
      :_  state
      :_  ~
      %^  request-card  /get-collections  %get
      !>(`"{base}/collections")
    ::
        %get-collection
      :_  state
      :_  ~
      %^  request-card  /get-collection  %post
      !>(`[(crip "{base}/collections/{(trip coll)}/get") ~ +.+.act])
    ::
        %create
      :_  state
      :_  ~
      %^  request-card  /create  %post
      !>(`[(crip "{base}/collections") ~ +.+.act])
    ::
        %update
      :_  state
      :_  ~
      %^  request-card  /update-collection  %post
      !>(`[(crip "{base}/collections/{(trip coll)}/update") ~ +.+.act])
    ::
        %delete 
      :_  state
      :_  ~
      %^  request-card  /delete-collection  %delete
      !>(`"{base}/collections/{(trip +.+.act)}")
    ::
        %add-document
      :_  state
      :_  ~
      %^  request-card  /add-document  %post
      !>(`[(crip "{base}/collections/{(trip coll)}/add") ~ +.+.act])
    ::
        %upsert-document
      :_  state
      :_  ~
      %^  request-card  /upsert-document  %post
      !>(`[(crip "{base}/collections/{(trip coll)}/upsert") ~ +.+.act])
    ::
        %query
      :_  state
      :_  ~
      %^  request-card  /query  %post
      !>(`[(crip "{base}/collections/{(trip coll)}/query") ~ +.+.act])
    ::
        %reset
      :_  state
      :_  ~
      %^  request-card  /reset  %post
      !>(`[(crip "{base}/reset") ~ ''])
    ::
        %create-embeddings
      ?~  api-key.state  
        !!
      =/  hedders  :~  'Authorization'^(crip "Bearer {(trip api-key.state)}")
                       'Content-Type'^'application/json'
                   ==
      =/  body  
        (crip "\{ \"input\": \"{(trip +.+.act)}\", \"model\": \"text-embedding-ada-002\" }")
      ~&  >>>  hedders
      ~&  >>>  body
      :_  state
      :_  ~
      %^  request-card  /create-embeddings  %post
      !>(`['https://api.openai.com/v1/embeddings' hedders body])
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