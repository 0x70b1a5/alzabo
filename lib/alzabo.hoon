/-  alz=alzabo
|%
::
::  json
::
++  enjs
  =,  enjs:format
  |%
  :: ++  collection
  :: ++  document
  :: ++  query-result
  ++  update
    |=  =update:alz
    ^-  json
    ?~  update  ~
    %-  pairs
    ?-    -.update
        %error
      [%error ~]~
    ::
        %api-key-saved
      [%api-key-saved ~]~
    ==
  --
++  dejs
  =,  dejs:format
  |%
  ++  uber-action
    ^-  $-(json action:alz)
    %-  ot
    :~  [%collection-name so]
        [%action action]
    ==
  ::
  ++  action
    %-  of
    :~  [%create ul]
        [%delete ul]
        [%add-document add-document]
        [%query query-collection]
    ::
        [%save-api-key so]
    ::
        [%reset ul]
    ==
  ::
  ++  add-document
    %-  ot
    :~  [%id (se %tas)]
        [%embeddings so]
        [%metadata (om so)]
        [%content so]
    ==
  ::
  ++  query-collection
    %-  ot
    :~  [%embeddings so]
        [%n-results ni]
        [%where (om so)]
    ==
  --
--