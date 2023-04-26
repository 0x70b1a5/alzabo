/-  alz=alzabo
/+  agentio,
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
++  on-watch  |=  p=path  (on-watch:def p)
++  on-agent  |=  [w=wire =sign:agent:gall]  (on-agent:def w sign)
++  on-arvo   |=  [w=wire =sign-arvo:agent:gall]  (on-arvo:def w sign-arvo)
::
++  on-peek
  |=  p=path
  ^-  (unit (unit cage))
  =,  format
  ~&  >>  p
  ?+    +.p  (on-peek:def p)
      [%collections ~]
    ~
      [%collection @ ~]
    ~
  ==
::
++  on-poke
  |=  [m=mark v=vase]
  ^-  (quip card _this)
  |^
  ~&  >  'got poked'
  ~&  >  v
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
    ~&  >>  act
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
      `state
      ::   %build
      :: =*  ubl
      ::   %~  .  uqbuild
      ::   :^    bowl
      ::       [repo-host repo-name branch-name commit-hash]:act
      ::     build-cache
      ::   ~
      :: :: =*  ubl
      :: ::   %=  ub-lib
      :: ::       repo-host    repo-host.act
      :: ::       repo-name    repo-name.act
      :: ::       branch-name  branch-name.act
      :: ::       commit-hash  commit-hash.act
      :: ::   ==
      :: =/  [built-file=vase =build-state:alz]
      ::   (build-file:ubl file-path.act)
      :: :_  state(build-cache build-cache.build-state)
      :: ?~  poke-src.act  ~
      :: :_  ~
      :: ?-    -.poke-src.act
      ::     %app
      ::   %+  ~(poke-our pass:io /pokeback/[p.poke-src.act])
      ::     p.poke-src.act
      ::   :-  %uqbuild-update
      ::   !>([%build %& built-file])
      :: ::
      ::     %ted
      ::   %+  ~(poke-our pass:io /pokeback/[p.poke-src.act])
      ::     %spider
      ::   :-  %spider-input
      ::   !>  ^-  [@tatid cage]
      ::   :+  p.poke-src.act  %uqbuild-update
      ::   !>([%build %& built-file])
      :: ==
    ==
  --
--