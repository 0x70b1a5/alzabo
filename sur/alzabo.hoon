|%
+$  state-0  [%0 api-key=@t]
+$  update
  $@  ~
  $%  [%error ~]
      [%api-key-saved ~]
  ==
+$  action
  $:  collection-name=@t
    $%  [%get-collections ~]
        [%get-collection id=@tas]
        ::
        [%create options=@t]
        [%delete options=@t]
        [%add-document options=@t]:: id=@tas embeddings=@t metadata=(map @tas @t) content=@t]
        [%query options=@t]:: embeddings=@t n-results=@ud where=(map @tas @t)]
        [%reset ~]
        ::
        [%save-api-key key=@t]
    ==
  ==
--