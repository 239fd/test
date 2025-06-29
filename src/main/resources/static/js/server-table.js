webix.ready(function () {
    const newRecords = [];

    webix.ui({
        container: "app",
        rows: [
            {
                view: "toolbar", elements: [
                    { view: "label", label: "Серверы" },
                    {},
                    {
                        view: "button", value: "Сохранить", width: 120, click: () => {
                            if (newRecords.length) {
                                webix.ajax().post("/api/server/save", newRecords)
                                    .then(() => {
                                        webix.message("Новые записи сохранены");
                                        newRecords.length = 0;
                                        $$("serverTable").clearAll();
                                        $$("serverTable").load("/api/server/info");
                                    });
                            }
                            else {
                                webix.message("Нет новых записей");
                            }
                        }
                    }
                ]
            },
            {
                view: "datatable",
                id: "serverTable",
                autoConfig: false,
                editable: true,
                editaction: "dblclick",
                select: "row",
                columns: [
                    { id: "id",   header: "ID",       editor: "text", width: 80 },
                    { id: "name", header: "Название", editor: "text", fillspace: true },
                    { id: "path", header: "Путь",     editor: "text", fillspace: true },
                    {
                        id: "edit",
                        header: { text: "Ред.", css: { "text-align": "center" } },
                        template: "<span class='webix_icon wxi-pencil' style='cursor:pointer;'></span>",
                        width: 60
                    },
                    {
                        id: "delete",
                        header: { text: "Удалить", css: { "text-align": "center" } },
                        template: "<span class='webix_icon wxi-trash' style='cursor:pointer;'></span>",
                        width: 60
                    }
                ],
                url: "/api/server/info",

                on: {
                    onItemDblClick: function (id) {
                        this.editCell(id.row, id.column);
                    },
                    onItemClick: function ({ row, column }) {
                        const item = this.getItem(row);

                        if (column === "delete") {
                            // Удаление
                            if (item.id.toString().startsWith("new_")) {
                                this.remove(row);
                                const idx = newRecords.findIndex(r => r.id === item.id);
                                if (idx >= 0) newRecords.splice(idx, 1);
                            }
                            else {
                                webix.confirm("Удалить запись?").then(() => {
                                    webix.ajax().del(`/api/server/delete/${item.id}`)
                                        .then(() => this.remove(row));
                                });
                            }
                        }
                        else if (column === "edit") {
                            // Редактирование всех полей: ставим фокус на первую колоночку
                            this.editRow(row);
                        }
                    }
                },

                scheme: {
                    $change: function (obj) {
                        if (!obj.id.toString().startsWith("new_") && obj.$dirty) {
                            webix.ajax().put(`/api/server/update/${obj.id}`, obj)
                                .then(() => {
                                    webix.message("Изменения сохранены");
                                    obj.$dirty = false;
                                });
                        }
                    }
                }
            }
        ]
    });

    // Кнопка «плюс» в хэдере колонки delete для добавления новых записей
    $$("serverTable").getHeaderNode("delete").innerHTML =
        "<span class='webix_icon wxi-plus' style='cursor:pointer;' onclick='addNewRecord()'></span>";

    window.addNewRecord = function () {
        const uid = "new_" + webix.uid();
        const newObj = { id: uid, name: "", path: "" };
        $$("serverTable").add(newObj, 0);
        newRecords.push(newObj);
        $$("serverTable").editRow(uid);
    };
});
