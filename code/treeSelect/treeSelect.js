var uid = 0;
class TreeSelect {
    static getUniquId() {
        return uid++;
    }
    constructor(options) {
        var self = this;

        var defaultOptions = {
            valueKey: 'id',
            isShowInput: true
        }
        self.options = options = $.extend(defaultOptions, options);
        var uid = TreeSelect.getUniquId();
        var tpl = `
            <input type="text" class="form-control treeSelect-input "/>
             <div class="ztree treeSelect-panel" id="treeSelect_panel_${uid}"></div>
        `;
        var ele = $(options.element);
        ele.html(tpl);
        var input = ele.find('.treeSelect-input');
        var panel = ele.find('.treeSelect-panel');
        panel.click(function (event) {
            if (event && event.stopPropagation) event.stopPropagation();
            else window.event.cancelBubble = true;
            return false;
        })
        self.element = ele;
        self.input = input;
        self.panel = panel;
        ele.css({
            'position': 'relative'
        });
        if (!self.options.isShowInput) {
            input.css('display', 'none');
            self.panel.css('position', 'relative');
        }
        input.on('keydown', function () {

            //input.val(self.text);
            return false;
        });

        input.click(function (event) {
            if (!self.isOpen()) {
                self.open(event);
            } else {
                self.close();
            }

        });
        if (options.url) {
            $.ajax({
                type: options.type,
                url: options.url,
                dataType: 'json',
                data: options.param,
                success: function (data) {
                    self.render(data);
                },
                error: function (data) {

                }
            })
        } else if (options.data) {
            self.render(options.data);
        }
    }

    isOpen() {
        var panel = this.panel;
        return !(panel.css('display') == 'none' || panel.height() == 0 || panel.css('opacity') == 0)
    }
    render(data) {
        var self = this;
        var panel = self.panel;
        var setting = {
            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            view: {
                selectedMulti: false
            },

            callback: {
                onClick: function (event, treeId, treeNode) {

                },
                onCheck: function onCheck(e, treeId, treeNode) {
                    var zTree = $.fn.zTree.getZTreeObj(treeId),
                        nodes = zTree.getCheckedNodes(true),
                        v = "",
                        k = "";
                    for (var i = 0, l = nodes.length; i < l; i++) {
                        if (!nodes[i].isParent) {
                            v += nodes[i].name + ",";
                            k += nodes[i][self.options.valueKey] + ",";
                        }
                    }
                    if (v.length > 0) v = v.substring(0, v.length - 1);
                    if (k.length > 0) k = k.substring(0, k.length - 1);
                    self.input.val(v);
                    self.value = k;
                    self.text = v;
                }
            }
        };
        self.ztree = $.fn.zTree.init(panel, setting, data);
        if (!self.options.isShowInput) {
            self.open();
        }
    }
    open(event) {
        if (event && event.stopPropagation) event.stopPropagation();
        else window.event.cancelBubble = true;
        var self = this;
        var panel = self.panel;
        panel.css({
            height: 'auto',
            opacity: 1
        });
        panel.show();
        if (self.options.isShowInput) {
            $(document).one("click", function (event) {
                self.close();
            });
        }
        // self.mask = $('<div class="treeSelect-mask"></div>');
        // if (self.options.isShowInput) {
        //     $('body').append(self.mask);
        // }
        // self.mask.click(function () {
        //     if (self.options.isShowInput) {
        //         self.close();
        //     }
        // })
    }
    close() {

        var self = this;
        self.panel.hide();
        // self.mask.remove();
    }
    /**
     * 设置选过的节点
     * @param {*} ids 
     */
    showSelectedNodes(ids) {
        var idArray = ids.split(',');
        var self = this;
        var tree = self.ztree;
        tree.checkAllNodes(false);
        idArray.forEach(function (id) {
            tree.checkNode(tree.getNodeByParam("id", id, null), true, true);
        });
    }
}