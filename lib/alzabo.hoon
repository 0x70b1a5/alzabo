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
    ::
        %update
      [%update s++.update]~
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
    :~  [%get-collections ul]
        [%get-collection so]
      ::
        [%create-collection so]
        [%update-collection so]
        [%query-collection so]
        [%delete-collection so]
      ::
        [%add-document so]
        [%upsert-document so]
      ::
        [%reset ul]
      ::
        [%save-api-key so]
        [%create-embeddings so]
        [%create-completion so]
    ==
  ::
  :: ++  add-document
  ::   %-  ot
  ::   :~  [%id (se %tas)]
  ::       [%embeddings so]
  ::       [%metadata (om so)]
  ::       [%content so]
  ::   ==
  :: ::
  :: ++  query-collection
  ::   %-  ot
  ::   :~  [%embeddings so]
  ::       [%n-results ni]
  ::       [%where (om so)]
  ::   ==
  --
--